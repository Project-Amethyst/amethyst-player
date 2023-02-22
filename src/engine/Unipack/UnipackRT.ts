import JSZip from "jszip";
import type { DeviceInfoCanvas, Canvas, KeyID, ProjectInfo, ProjectRT } from "../ProjectRT";
import type { ColorType, Color } from "../../types/color";
import { KeySound, Sound } from "./KeySound";
import KeyLED from "./KeyLED";
import AutoPlay from "./AutoPlay";

class UnipackRT implements ProjectRT {
    fileFormat = ".zip";

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
    currentLayer: number = 0;
    currentKeyPress: KeyID[] = [];
    keypressHistory = undefined;

    constructor(api: Canvas) {
        this.api = api;
    }

    //Meta
    LoadProjectFile(file: File): Promise<void> {
        if(this.loaded)
        {
            this.demoplay?.Stop();
        }
        console.log(`Loading Unipack ${file.name}`);
        // console.log(file);
        // this.api.setRGB(0, [1, 1], 255, 255, 255);
        this.api?.clear();
        this.api?.clearOverlay();

        this.currentLayer = 0;
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
                        if (text.charCodeAt(0) === 0xFEFF) {text = text.substr(1);} //Remove utf8 bom
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
                        this.projectInfo.layer = this.unipackInfo["chain"];
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
                this.keySound = new Array(this.unipackInfo["chain"])
                    .fill(null)
                    .map(() =>
                        new Array(this.unipackInfo.buttonX)
                            .fill(null)
                            .map(() =>
                                new Array(this.unipackInfo.buttonY).fill(null).map(() => new Array())
                            )
                    );

                this.keyLED = new Array(this.unipackInfo["chain"])
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
                        let index = fileInfo[4]?.charCodeAt(0) - 97; //97 is 'a'
                        index = isNaN(index) ? 0 : index;
                        let [layer, x, y, repeat] = [
                            parseInt(fileInfo[0]) - 1,
                            parseInt(fileInfo[2]) - 1,
                            parseInt(fileInfo[1]) - 1,
                            parseInt(fileInfo[3]),
                        ];
                        // console.log(fileInfo);
                        // console.log([layer, x, y, repeat, index]);
                        // console.log();
                        this.keyLED[layer][x][y][index] = new KeyLED(
                            text,
                            repeat,
                            this.api
                        );
                    } catch (err) {
                        throw "Unable to parse KeyLED file name - " + name.split("/").pop() + ": " + err;
                    }
                }

                //Load KeySound
                for (var line of keySoundFile) {
                    line = line.trim();
                    try {
                        if (line == "")
                            continue; //For empty lines

                        let command = line.split(" ");

                        let [layer, x, y, filename, loop, wormhole] = [
                            parseInt(command[0]) - 1,
                            parseInt(command[2]) - 1,
                            parseInt(command[1]) - 1,
                            command[3].toLowerCase(),
                            parseInt(command[4]), //Might be NaN
                            parseInt(command[5]) - 1, //Might be NaN
                        ];
                        
                        if(isNaN(loop)) {loop = 1}
                        if(isNaN(wormhole)) {wormhole = undefined}

                        this.keySound[layer][x][y].push(new KeySound(this.soundFiles[filename], loop, wormhole));
                    } catch {
                        throw "Unable to parse KeySound entry - " + line;
                    }
                }

                // Load AutoPlay
                if (autoplayFile !== undefined)
                {
                    this.demoplay = new AutoPlay(autoplayFile, this.api, this);
                    this.demoplay.Seek(0);
                }

                if(this.api?.options.showKeyPress)
                {
                    this.demoplay?.showActionKeys();
                }

                this.loaded = true;
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    ClearProjectFile(): void { }

    activeKeys:string[] = [];
    loggableKeys:string[] = [];

    //Input
    KeyPress(device: DeviceInfoCanvas, keyID: KeyID): void {
        let layer = this.IndexOfKeyID(device.info.layer_key, keyID);
        if (layer != -1) {
            if(!this.api?.options.learningMode || this.demoplay.status == "PLAYING")
            {
                this.LayerChange(layer)
            }
            else
            {
                this.activeKeys.push(["c", layer].toString())
            }
        }
        else
        {
            let soundLoop = 1;
            let [canvas_x, canvas_y] = keyID; //canvas_XY means the grid scope XY (Square), Raw XY will be the source XY (Including the layer keys)

            //KeyLED
            if (this.api!.options.lightAnimation && this.keyLED?.[this.currentLayer]?.[canvas_x]?.[canvas_y]?.length > 0) {
                let ledIndex = this.keypressHistory[canvas_x][canvas_y] % this.keyLED[this.currentLayer][canvas_x][canvas_y].length;
                this.keyLED[this.currentLayer][canvas_x][canvas_y][ledIndex]?.play();
            }

            //Sound
            if (this.keySound?.[this.currentLayer]?.[canvas_x]?.[canvas_y]?.length > 0) {
                let soundIndex = this.keypressHistory[canvas_x][canvas_y] % this.keySound[this.currentLayer][canvas_x][canvas_y].length;
                this.keySound[this.currentLayer][canvas_x][canvas_y][soundIndex]?.keyPress();
            }

            this.activeKeys.push(keyID.toString());
        }

        if(this.api?.options.learningMode && this.demoplay && this.demoplay.status != "PLAYING")
        {
            let requiredKeys = this.demoplay.getActionKeys();
            let allPressed = true;
            for(let key of requiredKeys)
            {
                if(!this.activeKeys.includes(key.toString()))
                {
                    allPressed = false;
                    break;
                }
            }

            // console.log(`Required Key Statified = ${allPressed}`)
            if(allPressed)
            {
                this.loggableKeys = this.loggableKeys.concat(requiredKeys.map(String));
                this.demoplay.Next(true);
            }
        }
    }

    KeyRelease(device: DeviceInfoCanvas, keyID: KeyID): void {
        let [canvas_x, canvas_y] = keyID;
        
        let layer = this.IndexOfKeyID(device.info.layer_key, keyID);
        if (layer != -1) {
            keyID = ["c", layer]
        }
        else
        {
            //KeyLED
            if (this.api!.options.lightAnimation && this.keyLED?.[this.currentLayer]?.[canvas_x]?.[canvas_y]?.length > 0) {
                let ledIndex = this.keypressHistory[canvas_x][canvas_y] % this.keyLED[this.currentLayer][canvas_x][canvas_y].length;
                this.keyLED[this.currentLayer][canvas_x][canvas_y][ledIndex]?.keyRelease();
            }

            //Sound (and wormhole)
            if (this.keySound[this.currentLayer]?.[canvas_x]?.[canvas_y]?.length > 0) {
                let soundIndex = this.keypressHistory[canvas_x][canvas_y] % this.keySound[this.currentLayer][canvas_x][canvas_y].length;
                this.keySound[this.currentLayer][canvas_x][canvas_y][soundIndex].keyRelease();
                if((!this.api?.options.learningMode || this.demoplay.status == "PLAYING") && this.keySound[this.currentLayer][canvas_x][canvas_y][soundIndex].wormhole != undefined)
                {
                    this.LayerChange(this.keySound[this.currentLayer][canvas_x][canvas_y][soundIndex]?.wormhole);
                }
            }
        }


        let index = this.activeKeys.indexOf(keyID.toString());
        if(index !== -1)
        {
            this.activeKeys.splice(index, 1);
        }

        //Update History
        if(!this.api?.options.learningMode || this.demoplay.status == "PLAYING")
        {
            this.logKeypressHistory(canvas_x, canvas_y);
        }
        else
        {
            // console.log(this.loggableKeys)
            // console.log(keyID.toString())
            if(this.loggableKeys.includes(keyID.toString()))
            {
                let loggableKeysIndex = this.loggableKeys.indexOf(keyID.toString());
                if(loggableKeysIndex !== -1)
                {
                    this.loggableKeys.splice(loggableKeysIndex, 1);
                }
                this.logKeypressHistory(canvas_x, canvas_y);
                // console.log("Logged")
            }
        }
    }

    LayerChange(layer: number): void { 
        if(layer < this.unipackInfo["chain"] && layer >= 0)
        {
            console.log(`Layer Change ${layer}`); 
            if (layer !== this.currentLayer) this.clearKeypressHistory();
            this.currentLayer = layer;
        }
    }

    GetLayerCount(): number {
        return this.unipackInfo["chain"];
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

    logKeypressHistory(x: number, y:number)
    {
        if (this.keypressHistory?.[x]?.[y] != undefined)
        this.keypressHistory[x][y]++;
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