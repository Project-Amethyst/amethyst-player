import JSZip from "jszip";
import type { DeviceInfoCanvas, Canvas, KeyID, ProjectInfo, ProjectRT } from "../ProjectRT";
import type { ColorType, Color } from "../../types/color";
import * as cbor from "cbor-web"

class ULP implements ProjectRT {
    fileFormat = ".ulp";

    //Data
    api?: Canvas;
    loaded:boolean = false;
    projectInfo: ProjectInfo = {};
    resources:any = {};

    //Runtime
    currentChain: number = 0;

    constructor(api: Canvas) {
        this.api = api;
    }

    //Meta
    LoadProjectFile(file: File): Promise<void> {
        console.log(`Loading ULP ${file.name}`);

        return new Promise(async (resolve, reject) => {
            try {
                // console.log(this.projectInfo)
                let zip = new JSZip();
                let files:any = await zip.loadAsync(file).then(
                    function (zip) {
                        return Object.values(zip.files);
                    },

                    function (e) {
                        throw "Failed to load selected file";
                        console.log(e);
                        return;
                    }
                );

                var meta;
                //Load projectInfo and categorize files
                for (let file of files) {
                    let filename = file.name.toLowerCase();
                    if(filename.startsWith("resources/"))
                    {
                        this.resources[filename.split("/").pop()] = await file.async("blob")
                    }
                    else if(filename === "meta.uad")
                    {
                        meta = cbor.decode(await file.async("arraybuffer"))
                        console.log(meta)

                        this.projectInfo.name = meta["title"];
                        this.projectInfo.author = meta["authors"][0];


                    }
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
        
    }

    KeyRelease(device: DeviceInfoCanvas, keyID: KeyID): void {
        
    }
    ChainChange(chain: number): void { console.log(`Chain Change ${chain}`) }

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

export default ULP;