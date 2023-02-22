import JSZip from "jszip";
import type { DeviceInfoCanvas, Canvas, KeyID, ProjectInfo, ProjectRT } from "../ProjectRT";
import type { ColorType, Color } from "../../types/color";
import {Pad, Sound} from "./Pad"
class SuperPadLights implements ProjectRT {
    fileFormat = ".zip";

    //Data
    api?: Canvas;
    loaded:boolean = false;
    projectInfo: ProjectInfo = {
        name: "Unknown",
        author: "Unknown",
        layer: 8,
        devices: {"main": [8, 8]}
    };

    soundFiles: {[id: string] : Sound} = {};

    pads?: {[index: number]: Pad} = {};
    currentLayer: number = 0;

    constructor(api: Canvas) {
        this.api = api;
    }

    //Meta
    LoadProjectFile(file: File): Promise<void> {
        console.log(`Loading Unipack ${file.name}`);
        this.api?.clear();
        this.api?.clearOverlay();

        this.currentLayer = 0;
        return new Promise(async (resolve, reject) => {
            try {
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

                let meta:Object|undefined;
                let info:Object;
                let animations:{[uuid:string]:Object} = {};
            
                //Load projectInfo and categorize files
                for (let file of files) {
                    let filename = file.name.toLowerCase();
                    // console.log(filename);

                    //folder
                    if (filename.endsWith("/")) {
                        continue
                    }

                    //Sound Files
                    if (filename.includes("sounds/") && filename.endsWith(".wav")) {
                        // console.log("Sound file: " + filename);
                        this.soundFiles[filename.split("/").pop().split(".")[0]] = await file
                        .async("blob")
                        .then(function (blob: Blob) {
                            return new Sound(blob, filename.split("/").pop());
                        });
                        continue;
                    }

                    //Json Files
                    if (filename.endsWith(".json")) {
                        let data = await file.async("text").then((data: string) => {return JSON.parse(data)});
                        if(filename.endsWith("meta.json")) //Custom json placed by the downloader
                        {
                            // console.log("Meta loaded")
                            meta = data;
                        }
                        else if(filename.includes("sounds/") && filename.endsWith("info.json"))
                        {
                            // console.log("Info loaded")
                            info = data;
                        }
                        else if(filename.includes("animations/"))
                        {
                            animations[filename.split("/").slice(-1)[0].split('.')[0]] = data;
                        }
                    }
                }

                    // console.log(meta);
                    // console.log(info!);
                    // console.log(animations!);
                    // console.log(this.soundFiles);

                if(meta)
                {
                    this.projectInfo.name = meta["title"];
                    this.projectInfo.author = meta["subtitle"];
                }

                if(info!)
                {
                    var pad_ids:string[] = [...new Set([].concat(...[Object.keys(info["behaviour"]), Object.keys(info["colors"]), Object.keys(info["lights"]), Object.keys(info["groups"])]))];
                    for(var pad_id of pad_ids)
                    {
                        this.pads[parseInt(pad_id.replace("pad", ""))] = new Pad(this.api, this.soundFiles[pad_id], info["behaviour"][pad_id], info["colors"][pad_id], animations[info["lights"][pad_id].toLowerCase()], info["groups"][pad_id])
                    }
                }
                else
                {
                    throw "This file is not a usable SuperPad Light pack (Missing info.json)";
                }

                this.loaded = true;
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    ClearProjectFile(): void { }

    //Input
    KeyPress(device: DeviceInfoCanvas, keyID: KeyID): void {
        let layer = this.IndexOfKeyID(device.info.layer_key, keyID);
        let [canvas_x, canvas_y] = keyID; //canvas_XY means the grid scope XY (Square), Raw XY will be the source XY (Including the layer keys)
        if (layer != -1) {
            this.LayerChange(layer)
        }
        else if (canvas_x >= 0 && canvas_x < 8 && canvas_y >= 0 && canvas_y < 8 ) 
        {
            let index = canvas_x + canvas_y * 8 + this.currentLayer * 64;
            this.pads[index]?.KeyPress();
        }
    }

    KeyRelease(device: DeviceInfoCanvas, keyID: KeyID): void {
        let layer = this.IndexOfKeyID(device.info.layer_key, keyID);
        let [canvas_x, canvas_y] = keyID; //canvas_XY means the grid scope XY (Square), Raw XY will be the source XY (Including the layer keys)
        if (canvas_x >= 0 && canvas_x < 8 && canvas_y >= 0 && canvas_y < 8 ) 
        {
            let index = canvas_x + canvas_y * 8 + this.currentLayer * 64;
            this.pads[index]?.KeyRelease();
        }
    }

    LayerChange(layer: number): void { 
        if(layer < this.projectInfo[layer] && layer >= 0)
        {
            console.log(`Layer Change ${layer}`); 
            this.currentLayer = layer;
        }
    }

    //Info
    GetProjectInfo(): ProjectInfo {
        return this.projectInfo;
    }

    GetLayer(): number {
        return this.currentLayer;
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

export default SuperPadLights;