import type { KeyID } from "src/types/devices";
import type { ColorType, Color } from "../types/color"

export interface Canvas {
  setColor: (deviceID: number, keyID: KeyID, color: Color) => void;
  clear: (deviceID: number) => void;
}