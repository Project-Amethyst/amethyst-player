import JSZip from "jszip";
import type {DeviceInfoCanvas, Canvas, KeyID, ProjectInfo, ProjectRT } from "../ProjectRT";
import type { ColorType, Color } from "../../types/color";
import {KeySound, Sound} from "./KeySound";
import KeyLED from "./KeyLED";
import AutoPlay from "./AutoPlay";

class UnipackRT implements ProjectRT {
    //Data
    api?: Canvas;
    info: ProjectInfo = {};
    soundFiles: {[name:string]: Sound} = {};
    keySound = [];
    autoplay = undefined;
    keyLED = undefined;

    //Runtime
    activeKeyLED = {}; //List of active keyLEDs so we can stop them
    currentChain: number = 0;
    currentKeyPress: KeyID[] = [];
    keypressHistory = undefined;

    constructor(api: Canvas) {
        this.api = api;
    }

    //Meta
    LoadProjectFile(file: File): Promise<void> {
        console.log(`Loading Unipack ${file.name}`);
        // console.log(file);
        // this.api.setRGB(0, [1, 1], 255, 255, 255);

        return new Promise(async (resolve, reject) => {
            try {
                // console.log(this.info)
                let zip = new JSZip();
                let files = await zip.loadAsync(file).then(
                    function (zip) {
                        return Object.values(zip.files);
                    },
                    function (e) {
                        throw "Failed to extract selected file";
                        console.log(e);
                        return;
                    }
                );
                let projectRoot:string;
                let keySoundFile:string[] = [];
                let autoplayFile:string[] = [];
                let keyLEDFiles:{[finename:string]: string[]} = {};

                //Load info and categorize files
                for (let file of files) {
                    let filename = file.name.toLowerCase();
                    if (!filename.endsWith("/")) {
                        //Ignore folder
                        if (filename.includes("sounds/")) {
                            // console.log("Sound file: " + filename);
                            this.soundFiles[filename.split("/").pop()] = await file
                                .async("blob")
                                .then(function (blob: Blob) {
                                    return new Sound(blob, filename.split("/").pop());
                                });
                        } else {
                            let text:string[] = await file.async("text").then((text: string) => {
                                return (text.split(/\r?\n/));
                            });
                            if (filename.endsWith("info")) {
                                //Text
                                // console.log("Info file: " + filename);
                                projectRoot = filename.slice(0, -4);
                                // console.log(" project root: " + projectRoot);
                                text.forEach(
                                    (info: string) => (this.info[info.split("=")[0]] = info.split("=")[1])
                                );
                                this.info["buttonX"] = parseInt(this.info["buttonX"]);
                                this.info["buttonY"] = parseInt(this.info["buttonY"]);
                                this.info["chain"] = parseInt(this.info["chain"]);
                                this.info["squareButton"] =
                                    this.info["squareButton"] === "true";
                                this.info["landscape"] = this.info["landscape"] === "true";
                                if (this.info["buttonX"] !== 8 || this.info["buttonY"] !== 8) {
                                    throw "Only 8x8 Unipad project are supported";
                                    return;
                                }
                                this.keypressHistory = new Array(this.info["buttonX"]).fill(null).map(() => new Array(this.info["buttonY"]).fill(0));
                            } else if (filename.endsWith("keysound")) {
                                // console.log("KeySound file: " + filename);
                                keySoundFile = text;
                            } else if (filename.endsWith("autoplay")) {
                                // console.log("AutoPlay file: " + filename);
                                autoplayFile = text;
                            } else if (filename.includes("keyled/")) {
                                // console.log("KeyLED file: " + filename);
                                keyLEDFiles[filename] = text;
                            } else {
                                // console.log("Unknown file: " + filename);
                            }
                        }
                    }
                }

                //Initialize 4D arraies
                this.keySound = new Array(this.info.chain)
                    .fill(null)
                    .map(() =>
                        new Array(this.info.buttonX)
                            .fill(null)
                            .map(() =>
                                new Array(this.info.buttonY).fill(null).map(() => new Array())
                            )
                    );

                this.keyLED = new Array(this.info.chain)
                    .fill(null)
                    .map(() =>
                        new Array(this.info.buttonX)
                            .fill(null)
                            .map(() =>
                                new Array(this.info.buttonY).fill(null).map(() => new Array())
                            )
                    );

                // Load KeyLED
                for (var [name, text] of Object.entries(keyLEDFiles)) {
                    let fileInfo = name.split("/").pop().split(" ");
                    try {
                        // if (fileInfo.length === 5) {
                        //   this.keyLED[parseInt(fileInfo[0]) - 1][parseInt(fileInfo[2]) - 1][parseInt(fileInfo[1]) - 1][fileInfo[4].charCodeAt(0) - 97] = new KeyLED(text, parseInt(fileInfo[3]), this.Canvas)
                        //   // console.log(name)
                        //   // console.log([parseInt(fileInfo[0]) - 1, parseInt(fileInfo[2]) - 1, parseInt(fileInfo[1]) - 1, fileInfo[4].charCodeAt(0) - 97])
                        //   // console.log(this.keyLED[parseInt(fileInfo[0]) - 1][parseInt(fileInfo[2]) - 1][parseInt(fileInfo[1]) - 1][fileInfo[4].charCodeAt(0) - 97])
                        // }
                        // else if (fileInfo.length === 4) {
                        let index = fileInfo[4] !== undefined ? fileInfo[4].charCodeAt(0) - 97 : 0; //97 is 'a'
                        // console.log([parseInt(fileInfo[0]) - 1, parseInt(fileInfo[2]) - 1, parseInt(fileInfo[1]) - 1, index])
                        let [chain, x, y, repeat] = [
                            parseInt(fileInfo[0]) - 1,
                            parseInt(fileInfo[2]) - 1,
                            parseInt(fileInfo[1]) - 1,
                            parseInt(fileInfo[3]),
                        ];
                        this.keyLED[chain][x][y][index] = new KeyLED(
                            text,
                            repeat,
                            this.api
                        );
                    } catch (err) {
                        throw "Unable to parse KeyLED - " + name.split("/").pop() + ": " + err;
                    }
                }

                //Load KeySound
                for (var line of keySoundFile) {
                    line = line.trim();
                    try {
                        if (line == "")
                            continue; //For empty lines

                        let command = line.split(" ");

                        // console.log(command);
                        let [chain, x, y, filename, loop] = [
                            parseInt(command[0]) - 1,
                            parseInt(command[2]) - 1,
                            parseInt(command[1]) - 1,
                            command[3].toLowerCase(),
                            parseInt(command[4]), //Might be undefined
                        ];
                        // console.log([chain, x, y, filename])
                        this.keySound[chain][x][y].push(new KeySound(this.soundFiles[filename], loop));
                    } catch {
                        throw "Unable to parse line - " + line;
                    }
                }

                //Load AutoPlay
                // if (autoplayFile !== undefined)
                //     this.autoplay = new AutoPlay(autoplayFile, this.Canvas);

                console.log("Project Loaded");
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }

    ClearProjectFile(): void { }

    //Input
    KeyPress(device: DeviceInfoCanvas, keyID: KeyID): void {
        let chain = this.IndexOfKeyID(device.info.chain_key, keyID);
        if(chain != -1)
        {
            this.ChainChange(chain)
            return;
        }
        // const currentKeyPressIndex = this.currentKeyPress.indexOf(keyID);
        // if (currentKeyPressIndex == -1) {
        //     this.currentKeyPress.push(keyID); // 2nd parameter means remove one item only
        // }

        let soundLoop = 1;
        let [Canvas_x, Canvas_y] = keyID; //Canvas_XY means the grid scope XY (Square), Raw XY will be the source XY (Including the chain keys)

        // console.log("Note On - " + x.toString() + " " + y.toString());
        // // console.log([x, y, Canvas_x, Canvas_y])

        // if (this.props.projectFile !== undefined) {
        //   if (Canvas_x >= 0 && Canvas_x < 8 && Canvas_y >= 0 && Canvas_y < 8) {
        // //LED
        // if (led && this.keyLED !== undefined && this.keyLED[this.currentChain] !== undefined && this.keyLED[this.currentChain][Canvas_x] !== undefined && this.keyLED[this.currentChain][Canvas_x][Canvas_y] !== undefined && this.keyLED[this.currentChain][Canvas_x][Canvas_y].length > 0) {
        //   let ledIndex = this.keypressHistory[Canvas_x][Canvas_y] % this.keyLED[this.currentChain][Canvas_x][Canvas_y].length;
        //   this.keyLED[this.currentChain][Canvas_x][Canvas_y][ledIndex].stop();
        //   this.keyLED[this.currentChain][Canvas_x][Canvas_y][ledIndex].play();
        // }

        //KeyLED
        if (
            this.keyLED?.[this.currentChain]?.[Canvas_x]?.[Canvas_y] &&
            this.keyLED[this.currentChain][Canvas_x][Canvas_y].length > 0
        ) {
            let ledIndex = this.keypressHistory[Canvas_x][Canvas_y] % this.keyLED[this.currentChain][Canvas_x][Canvas_y].length;
            this.keyLED[this.currentChain][Canvas_x][Canvas_y][ledIndex].play();
        }

        //Sound
        if (
            this.keySound?.[this.currentChain]?.[Canvas_x]?.[Canvas_y] &&
            this.keySound[this.currentChain][Canvas_x][Canvas_y].length > 0
        ) {
            let soundIndex = this.keypressHistory[Canvas_x][Canvas_y] % this.keySound[this.currentChain][Canvas_x][Canvas_y].length;
            this.keySound[this.currentChain][Canvas_x][Canvas_y][soundIndex].keyPress();
        }
    }

    KeyRelease(device: DeviceInfoCanvas, keyID: KeyID): void { 
        let [Canvas_x, Canvas_y] = keyID;
        
        if (
            this.keySound[this.currentChain]?.[Canvas_x]?.[Canvas_y] &&
            this.keySound[this.currentChain][Canvas_x][Canvas_y].length > 0
        ) {
            //Sound
            let soundIndex = this.keypressHistory[Canvas_x][Canvas_y] % this.keySound[this.currentChain][Canvas_x][Canvas_y].length;
            this.keySound[this.currentChain][Canvas_x][Canvas_y][soundIndex].keyRelease();
        }
        
    }
    ChainChange(chain: number): void {console.log(`Chain Change ${chain}`) }

    //Autoplay
    AutoplayStart(): void { }
    AutoplayStop(): void { }
    AutoplayNext(): void { }
    AutoplayPrevious(): void { }
    AutoplaySeek(position: number): void { }

    //Info
    GetProjectInfo(): ProjectInfo {
        return this.info;
    }
    GetAutoplayProgress(): [number, number] {
        return [0, 0];
    }
    GetChain(): number {
        return 0;
    }

    //Helper
    IndexOfKeyID(array: KeyID[], target: KeyID): number
    {   
        if(Array.isArray(target))
        {
            for(var k:number = 0; k < array.length; k++){
                if(array[k][0] == target[0] && array[k][1] == target[1]){
                    return k
                }
            }
        }
        return -1;
    }
}

export default UnipackRT;