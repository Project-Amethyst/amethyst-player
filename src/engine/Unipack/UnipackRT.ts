import JSZip from "jszip";
import type { canvas, KeyID, ProjectInfo, ProjectRT } from "./ProjectRT";
import  type { ColorType, Color } from "../../types/color"
import KeySound from "./KeySound"
import KeyLED from "./KeyLED"
import AutoPlay from "./AutoPlay";

class UnipackRT implements ProjectRT {
    api?: canvas;
    info: ProjectInfo = {};
    soundFiles = {};
    keySound: {[key:string]: KeySound} = {};
    autoplay = undefined;
    keyLED = undefined;
    canvas = undefined;
    activeKeyLED = {};
    currentChain:number = 0

    constructor(api: canvas) {
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
                        reject("Failed to extract selected file");
                        console.log(e);
                        return;
                    }
                );
                let projectRoot = undefined;
                let keySoundFile = undefined;
                let autoplayFile = undefined;
                let keyLEDFiles = {};

                //Load info and categorize files
                for (let file of files) {
                    let filename = file.name.toLowerCase();
                    if (!filename.endsWith("/")) {
                        //Ignore folder
                        if (filename.includes("sounds/")) {
                            // console.log("Sound file: " + filename);
                            this.soundFiles[filename.split("/").pop()] = await file
                                .async("blob")
                                .then(function (blob) {
                                    return new KeySound(blob, filename.split("/").pop());
                                });
                        } else {
                            let text = await file.async("text").then((text) => {
                                return (text = text.split(/\r?\n/));
                            });
                            if (filename.endsWith("info")) {
                                //Text
                                // console.log("Info file: " + filename);
                                projectRoot = filename.slice(0, -4);
                                // console.log(" project root: " + projectRoot);
                                text.forEach(
                                    (info) => (this.info[info.split("=")[0]] = info.split("=")[1])
                                );
                                this.info["buttonX"] = parseInt(this.info["buttonX"]);
                                this.info["buttonY"] = parseInt(this.info["buttonY"]);
                                this.info["chain"] = parseInt(this.info["chain"]);
                                this.info["squareButton"] =
                                    this.info["squareButton"] === "true";
                                this.info["landscape"] = this.info["landscape"] === "true";
                                // console.log(" title: " + this.info["title"])
                                // console.log(" producerName: " + this.info["producerName"])
                                // console.log(" buttonX: " + this.info["buttonX"])
                                // console.log(" buttonY: " + this.info["buttonY"])
                                // console.log(" chain: " + this.info["chain"])
                                // console.log(" squareButton: " + this.info["squareButton"])
                                // console.log(" landscape: " + this.info["landscape"])
                                if (this.info["buttonX"] !== 8 || this.info["buttonY"] !== 8) {
                                    reject("Only 8x8 Unipad project are supported");
                                    return;
                                }
                                if (this.info["chain"] > 8) {
                                    // reject("Only Unipad project that has within 8 chains are supported");
                                    // alert(`This Unipad Project has ${this.info["chain"]} chains. Projects that has more than 8 chains are limited supported`)
                                    // return;
                                }
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
                        //   this.keyLED[parseInt(fileInfo[0]) - 1][parseInt(fileInfo[2]) - 1][parseInt(fileInfo[1]) - 1][fileInfo[4].charCodeAt(0) - 97] = new KeyLED(text, parseInt(fileInfo[3]), this.canvas)
                        //   // console.log(name)
                        //   // console.log([parseInt(fileInfo[0]) - 1, parseInt(fileInfo[2]) - 1, parseInt(fileInfo[1]) - 1, fileInfo[4].charCodeAt(0) - 97])
                        //   // console.log(this.keyLED[parseInt(fileInfo[0]) - 1][parseInt(fileInfo[2]) - 1][parseInt(fileInfo[1]) - 1][fileInfo[4].charCodeAt(0) - 97])
                        // }
                        // else if (fileInfo.length === 4) {
                        let index =
                            fileInfo[4] !== undefined ? fileInfo[4].charCodeAt(0) - 97 : 0; //97 is 'a'
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
                            this.canvas,
                            [chain, x, y, index],
                            this.activeKeyLED
                        );
                        // }
                        // else {
                        //   console.warn("Unknown keyLED file name: " + name);
                        // }
                    } catch(err) {
                        console.warn(
                            "Unable to parse file - " + name.split("/").pop() + ": " + err
                        );
                    }
                }

                //Load KeySound
                for (var line of keySoundFile) {
                    line = line.trim();
                    try {
                        if (line == "")
                            //For empty lines
                            continue;

                        let command = line.split(" ");

                        // console.log(command);
                        let [chain, x, y, filename] = [
                            parseInt(command[0]) - 1,
                            parseInt(command[2]) - 1,
                            parseInt(command[1]) - 1,
                            command[3].toLowerCase(),
                        ];
                        // console.log([chain, x, y, filename])
                        this.keySound[chain][x][y].push([
                            this.soundFiles[filename],
                            command.slice(4),
                        ]);
                    } catch {
                        console.warn("Unable to parse line - " + line);
                    }
                }

                //Load AutoPlay
                if(autoplayFile !== undefined)
                    this.autoplay = new AutoPlay(autoplayFile, this.canvas);
                
                console.log("Project Loaded")
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }

    ClearProjectFile(): void { }

    //Input
    KeyPress(deviceID: number, keyID: KeyID): void {

    }

    KeyRelease(deviceID: number, keyID: KeyID): void { }
    ChainChange(chain: number): void { }

    //Autoplay
    AutoplayStart(): void { }
    AutoplayStop(): void { }
    AutoplayNext(): void { }
    AutoplayPrevious(): void { }
    AutoplaySeek(position: number): void { }

    //Info
    GetProjectInfo(): ProjectInfo {
        return 
    }
    GetAutoplayProgress(): [number, number] {
        return [0, 0];
    }
    GetChain(): number {
        return 0;
    }
}

export default UnipackRT;
