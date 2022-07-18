import type { ProjectInfo, ProjectRT } from "./ProjectRT";

class UnipackRT implements ProjectRT
{   
    info?: ProjectInfo;
    soundFiles = {};
    keySound = undefined;
    autoplay = undefined;
    keyLED = undefined;
    canvas = undefined;
    activeKeyLED = {};

    //Meta
    LoadProjectFile(file: Blob): void
    {

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