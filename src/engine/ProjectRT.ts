import type { KeyID } from "src/types/devices";
import type {canvas} from "./CanvasAPI"

export interface ProjectInfo{
    name: string;
    author: string; //TODO we can have a number type for user ID
}

export interface ProjectRT {
    constructor: (api: canvas) => void;
    //Meta
    LoadProjectFile: (file: File) => void;
    ClearProjectFile: () => void;

    //Input
    KeyPress: (deviceID: number, keyID:KeyID) => void;
    KeyRelease: (deviceID: number, keyID:KeyID) => void;
    ChainChange: (chain:number) => void;

    //Autoplay
    AutoplayStart: () => void;
    AutoplayStop: () => void;
    AutoplayNext: () => void;
    AutoplayPrevious: () => void;
    AutoplaySeek: (position: number) => void;

    //Info
    GetProjectInfo: () => ProjectInfo;
    GetAutoplayProgress: () => [number, number];
    GetChain: () => number;
}