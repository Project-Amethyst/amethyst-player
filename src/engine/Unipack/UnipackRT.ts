import type { ProjectInfo, ProjectRT } from "./ProjectRT";

class UnipackRT implements ProjectRT
{   
    api?: object;
    info?: ProjectInfo;
    soundFiles = {};
    keySound = undefined;
    autoplay = undefined;
    keyLED = undefined;
    canvas = undefined;
    activeKeyLED = {};

    constructor(api: object)
    {
        this.api = api
    }

    //Meta
    LoadProjectFile(file: Blob): void
    {
        console.log("Loading Unipack")
        console.log(file);
        this.api.setRGB(0, [1, 1], 255, 255, 255);
    }

    ClearProjectFile(): void{}

    //Input
    KeyPress(x:number, y:number): void{}
    KeyRelease(x:number, y:number): void{}
    ChainChange(chain:number): void{}

    //Autoplay
    AutoplayStart(): void{}
    AutoplayStop(): void{}
    AutoplayNext(): void{}
    AutoplayPrevious(): void{}
    AutoplaySeek(position: number): void{}

    //Info
    GetProjectInfo(): ProjectInfo {return {name: "Test Name", author: "Test Author"}}
    GetAutoplayProgress():[number, number] {return [0, 0]}
    GetChain(): number {return 0};
}

export default UnipackRT