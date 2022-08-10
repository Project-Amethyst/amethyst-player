import JSZip from "jszip";
import type { DeviceInfoCanvas, Canvas, KeyID, ProjectInfo, ProjectRT } from "../ProjectRT";
import type { ColorType, Color } from "../../types/color";
import { KeySound, Sound } from "./KeySound";
import KeyLED from "./KeyLED";
import AutoPlay from "./AutoPlay";

class UnipackRT implements ProjectRT {
    //Data
    api?: Canvas;
    loaded:boolean = false;
    projectInfo: ProjectInfo = {};
    unipackInfo = {}
    soundFiles: { [name: string]: Sound } = {};
    keySound = [];
    demoplay = undefined;
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
                // console.log(this.projectInfo)
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
                let projectRoot: string;
                let keySoundFile: string[];
                let autoplayFile: string[];
                let keyLEDFiles: { [finename: string]: string[] } = {};

                //Load projectInfo and categorize files
                for (let file of files) {
                    let filename = file.name.toLowerCase();

                    //folder
                    if (filename.endsWith("/")) {
                        continue
                    }

                    //Sound Files
                    if (filename.includes("sounds/")) {
                        // console.log("Sound file: " + filename);
                        this.soundFiles[filename.split("/").pop()] = await file
                            .async("blob")
                            .then(function (blob: Blob) {
                                return new Sound(blob, filename.split("/").pop());
                            });
                        continue;
                    }


                    //Text Files
                    let filetype: string = "unknown";
                    if (filename.endsWith("info")) {
                        filetype = "projectInfo"
                    }
                    else if (filename.endsWith("keysound")) {
                        filetype = "keySound"
                    }
                    else if (filename.endsWith("autoplay")) {
                        filetype = "autoplay"
                    }
                    else if (filename.includes("keyled/")) {
                        filetype = "keyLED"
                    }

                    if (filetype == "unknown") {
                        console.warn("Unknown file: " + filename);
                        continue;
                    }

                    let text: string[] = await file.async("text").then((text: string) => {
                        return (text.split(/\r?\n/));
                    });

                    if (filetype == "projectInfo") {
                        //Text
                        // console.log("Info file: " + filename);
                        projectRoot = filename.slice(0, -4);
                        // console.log(" project root: " + projectRoot);
                        text.forEach(
                            (info: string) => (this.unipackInfo[info.split("=")[0]] = info.split("=")[1])
                        );
                        this.unipackInfo["buttonX"] = parseInt(this.unipackInfo["buttonX"]);
                        this.unipackInfo["buttonY"] = parseInt(this.unipackInfo["buttonY"]);
                        this.unipackInfo["chain"] = parseInt(this.unipackInfo["chain"]);
                        this.unipackInfo["squareButton"] = this.unipackInfo["squareButton"] === "true";
                        this.unipackInfo["landscape"] = this.unipackInfo["landscape"] === "true";
                        if (this.unipackInfo["buttonX"] !== 8 || this.unipackInfo["buttonY"] !== 8) {
                            throw "Only 8x8 Unipad project are supported";
                            return;
                        }

                        this.projectInfo.name = this.unipackInfo["title"];
                        this.projectInfo.author = this.unipackInfo["producerName"];
                        this.projectInfo.chain = this.unipackInfo["chain"];
                        this.projectInfo.devices = {"main": [this.unipackInfo["buttonX"], this.unipackInfo["buttonY"]]};

                        this.keypressHistory = new Array(this.unipackInfo["buttonX"]).fill(null).map(() => new Array(this.unipackInfo["buttonY"]).fill(0));
                    } else if (filetype == "keySound") {
                        // console.log("KeySound file: " + filename);
                        keySoundFile = text;
                    } else if (filetype == "autoplay") {
                        // console.log("AutoPlay file: " + filename);
                        autoplayFile = text;
                    } else if (filetype == "keyLED") {
                        // console.log("KeyLED file: " + filename);
                        keyLEDFiles[filename] = text;
                    } else {
                        console.warn("Unknown file: " + filename);
                    }
                }


                //Checking if vaild
                if (projectRoot === undefined || keySoundFile === undefined) {
                    throw "This file is not a vaild Unipack";
                }

                //Initialize 4D arraies
                this.keySound = new Array(this.unipackInfo.chain)
                    .fill(null)
                    .map(() =>
                        new Array(this.unipackInfo.buttonX)
                            .fill(null)
                            .map(() =>
                                new Array(this.unipackInfo.buttonY).fill(null).map(() => new Array())
                            )
                    );

                this.keyLED = new Array(this.unipackInfo.chain)
                    .fill(null)
                    .map(() =>
                        new Array(this.unipackInfo.buttonX)
                            .fill(null)
                            .map(() =>
                                new Array(this.unipackInfo.buttonY).fill(null).map(() => new Array())
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

                        let [chain, x, y, filename, loop, wormhole] = [
                            parseInt(command[0]) - 1,
                            parseInt(command[2]) - 1,
                            parseInt(command[1]) - 1,
                            command[3].toLowerCase(),
                            parseInt(command[4]), //Might be NaN
                            parseInt(command[5]), //Might be NaN
                        ];
                        
                        if(isNaN(loop)) {loop = 1}
                        if(isNaN(wormhole)) {wormhole = undefined}

                        this.keySound[chain][x][y].push(new KeySound(this.soundFiles[filename], loop, wormhole));
                    } catch {
                        throw "Unable to parse line - " + line;
                    }
                }

                // Load AutoPlay
                if (autoplayFile !== undefined)
                    this.demoplay = new AutoPlay(autoplayFile, this.api, this);
                ;
                this.loaded = true;
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
        if (chain != -1) {
            this.ChainChange(chain)
            return;
        }
        // const currentKeyPressIndex = this.currentKeyPress.indexOf(keyID);
        // if (currentKeyPressIndex == -1) {
        //     this.currentKeyPress.push(keyID); // 2nd parameter means remove one item only
        // }

        let soundLoop = 1;
        let [canvas_x, canvas_y] = keyID; //canvas_XY means the grid scope XY (Square), Raw XY will be the source XY (Including the chain keys)

        // console.log("Note On - " + x.toString() + " " + y.toString());
        // // console.log([x, y, canvas_x, canvas_y])

        // if (this.props.projectFile !== undefined) {
        //   if (canvas_x >= 0 && canvas_x < 8 && canvas_y >= 0 && canvas_y < 8) {
        // //LED
        // if (led && this.keyLED !== undefined && this.keyLED[this.currentChain] !== undefined && this.keyLED[this.currentChain][canvas_x] !== undefined && this.keyLED[this.currentChain][canvas_x][canvas_y] !== undefined && this.keyLED[this.currentChain][canvas_x][canvas_y].length > 0) {
        //   let ledIndex = this.keypressHistory[canvas_x][canvas_y] % this.keyLED[this.currentChain][canvas_x][canvas_y].length;
        //   this.keyLED[this.currentChain][canvas_x][canvas_y][ledIndex].stop();
        //   this.keyLED[this.currentChain][canvas_x][canvas_y][ledIndex].play();
        // }

        //KeyLED
        if (this.keyLED?.[this.currentChain]?.[canvas_x]?.[canvas_y]?.length > 0) {
            let ledIndex = this.keypressHistory[canvas_x][canvas_y] % this.keyLED[this.currentChain][canvas_x][canvas_y].length;
            this.keyLED[this.currentChain][canvas_x][canvas_y][ledIndex].play();
        }

        //Sound
        if (this.keySound?.[this.currentChain]?.[canvas_x]?.[canvas_y]?.length > 0) {
            let soundIndex = this.keypressHistory[canvas_x][canvas_y] % this.keySound[this.currentChain][canvas_x][canvas_y].length;
            this.keySound[this.currentChain][canvas_x][canvas_y][soundIndex].keyPress();
        }
    }

    KeyRelease(device: DeviceInfoCanvas, keyID: KeyID): void {
        let [canvas_x, canvas_y] = keyID;

        //KeyLED
        if (this.keyLED?.[this.currentChain]?.[canvas_x]?.[canvas_y]?.length > 0) {
            let ledIndex = this.keypressHistory[canvas_x][canvas_y] % this.keyLED[this.currentChain][canvas_x][canvas_y].length;
            this.keyLED[this.currentChain][canvas_x][canvas_y][ledIndex].endLoop();
        }

        //Sound (and wormhole)
        if (this.keySound[this.currentChain]?.[canvas_x]?.[canvas_y]?.length > 0) {
            let soundIndex = this.keypressHistory[canvas_x][canvas_y] % this.keySound[this.currentChain][canvas_x][canvas_y].length;
            this.keySound[this.currentChain][canvas_x][canvas_y][soundIndex].keyRelease();
            if(this.keySound[this.currentChain][canvas_x][canvas_y][soundIndex].wormhole != undefined)
            {
                this.ChainChange(this.keySound[this.currentChain][canvas_x][canvas_y][soundIndex].wormhole);
            }
        }

        //Update History
        if (this.keypressHistory?.[canvas_x]?.[canvas_y] != undefined)
            this.keypressHistory[canvas_x][canvas_y]++;

    }
    ChainChange(chain: number): void { 
        if(chain < this.unipackInfo["chain"])
        {
            console.log(`Chain Change ${chain}`); 
            if (chain !== this.currentChain) this.clearKeypressHistory();
            this.currentChain = chain;
        }
    }

    //Autoplay
    AutoplayStart(): void { }
    AutoplayStop(): void { }
    AutoplayNext(): void { }
    AutoplayPrevious(): void { }
    AutoplaySeek(position: number): void { }

    //Info
    GetProjectInfo(): ProjectInfo {
        return this.projectInfo;
    }
    GetAutoplayProgress(): [number, number] {
        return [0, 0];
    }
    GetChain(): number {
        return 0;
    }

    clearKeypressHistory() {
        this.keypressHistory = new Array(this.unipackInfo["buttonX"]).fill(null).map(() => new Array(this.unipackInfo["buttonY"]).fill(0));
    }

    //Helper
    IndexOfKeyID(array: KeyID[], target: KeyID): number {
        if (Array.isArray(target)) {
            for (var k: number = 0; k < array.length; k++) {
                if (array[k][0] == target[0] && array[k][1] == target[1]) {
                    return k
                }
            }
        }
        return -1;
    }
}

export default UnipackRT;