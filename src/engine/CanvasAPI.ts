import type { KeyID, DeviceInfo } from "src/types/devices";
import type { ColorType, Color } from "../types/color"

export type KeyPress = (deviceID: number, keyID: KeyID) => unknown;
export type KeyRelease = (deviceID: number, keyID: KeyID) => unknown;

export interface DeviceInfoCanvas
{
    id: number,
    pos: [number, number],
    info: DeviceInfo
}


export interface Canvas {
  setColor: (deviceID: number, keyID: KeyID, color: Color) => void;
  clear: (deviceID?: number) => void;
  
  setOverlay: (deviceID: number, keyID: KeyID, color: Color) => void;
  unsetOverlay: (deviceID: number, keyID: KeyID) => void,
  clearOverlay: (deviceID?: number) => void,

  getDevices: () => DeviceInfoCanvas[];
  options: object;
}