export interface ProjectInfo{
    name: string;
    author: string; //TODO we can have a number type for user ID
}

export interface ProjectRT {
    constructor: (api: object) => void;
    //Meta
    LoadProjectFile: (file: Blob) => void;
    ClearProjectFile: () => void;

    //Input
    KeyPress: (x:number, y:number) => void;
    KeyRelease: (x:number, y:number) => void;
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