import type { Input, Output } from "webmidi";

export interface GridDeviceConfig {
  name: string;
  defaultChannel:number;
  midiNameRegex?: string;
  keymap: number[][];
  /** [Width, Height] */
  dimension: [number, number];
  /** Grid Only: [Width, Height] */
  gridDimension: [number, number];
  /** [X, Y] */
  gridOffset: [number, number];
  chainKey: [number,number][];
  noteToXY: (note: number) => [number, number];
  rgbSysexGen?: (x: number, y: number, color: number) => number[];
  initializationSysex?: number[];
  specialLED?: [number, number][];
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
