import type { DeviceInfo, KeyID } from "src/types/devices";
export type { DeviceInfo, KeyID } from "src/types/devices";

import type { Canvas, DeviceInfoCanvas } from "./CanvasAPI"
export type { Canvas, DeviceInfoCanvas } from "./CanvasAPI"

export interface ProjectInfo{
    name: string;
    author: string; //TODO we can have a number type for user ID
    layer: number;
    devices: {[name:string]: [number, number]}; //name and size
}

export interface ProjectRT {
    constructor: (api: Canvas) => void;
    //Meta
    LoadProjectFile: (file: File) => Promise<void>;
    ClearProjectFile: () => void;

    //Input
    KeyPress: (device: DeviceInfoCanvas, keyID:KeyID) => void;
    KeyRelease: (device: DeviceInfoCanvas, keyID:KeyID) => void;
    LayerChange: (layer:number) => void;

    // Getters
    GetLayerCount: () => number;

    // Info
    readonly loaded: boolean;
    readonly currentLayer: number;
    readonly projectInfo: ProjectInfo;

    readonly fileFormat:string; //Format of file

    //Demoplay
    demoplay?: 
    {
        readonly playing: boolean;
        readonly progress: number;
        readonly total: number;
        Start: () => void;
        Pause: () => void;
        Next: () => void;
        Previous: () => void;
        Seek: (position: number) => void;
    }
}

