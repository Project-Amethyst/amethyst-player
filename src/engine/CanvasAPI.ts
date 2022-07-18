import type { KeyID } from "src/types/devices";

export interface canvas {
  setRGB: (deviceID: number, keyID: KeyID, r: number, g: number, b: number) => void;
  clear: (deviceID: number) => void;
}