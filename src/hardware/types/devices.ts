import type { Input, Output } from "webmidi";

export enum KeyType
{
  Note = "N",
  CC = "C",
  Sysex = "X",
}

export type Position = [number, number];
export type Dimension = [number, number] 
export type DeviceKeyID = number | [KeyType, number];

export interface GridDeviceConfig {
  name: string;
  paletteChannel:{[Name:string]: number};
  midiNameRegex?: string;
  keymap: DeviceKeyID[][];
  /** [Width, Height] */
  dimension: Dimension;
  /** Grid Only: [Width, Height] */
  gridDimension: Dimension;
  /** [X, Y] */
  gridOffset: Position;
  layerKey: Position[];
  noteToXY: (note: number) => Position;
  specialLED?: DeviceKeyID[];
  rgbSysexGen?: (keyID: DeviceKeyID, color: [number, number, number]) => number[];
  initializationSysex?: number[][];
}

export class MidiDevice {
  name: string;
  input?: Input;
  output?: Output;
  config?: GridDeviceConfig;

  constructor(name: string, input?: Input, output ?: Output, config ?: GridDeviceConfig)
  {
    this.name = name;
    this.input = input;
    this.output = output;
    this.config = config;
  }
} 
