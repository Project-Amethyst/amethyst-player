import {KeyType} from "../types/devices";
import type {DeviceKeyID, GridDeviceConfig } from "../types/devices";

const config: GridDeviceConfig = {
    name: "Launchpad Mini MK3",
    midiNameRegex: "Launchpad Mini|LPMiniMK3 MIDI",

    paletteChannel: {
      "classic": 1
    },

    keymap: [
        [91, 92, 93, 94, 95, 96, 97, 98, 99],
        [81, 82, 83, 84, 85, 86, 87, 88, 89],
        [71, 72, 73, 74, 75, 76, 77, 78, 79],
        [61, 62, 63, 64, 65, 66, 67, 68, 69],
        [51, 52, 53, 54, 55, 56, 57, 58, 59],
        [41, 42, 43, 44, 45, 46, 47, 48, 49],
        [31, 32, 33, 34, 35, 36, 37, 38, 39],
        [21, 22, 23, 24, 25, 26, 27, 28, 29],
        [11, 12, 13, 14, 15, 16, 17, 18, 19]],
    
        dimension: [9, 9],
        gridDimension: [8, 8],
        gridOffset: [0, 1],
        layerKey: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]],
        
    noteToXY(note)
    {
      if(note >= 1 && note <= 99 && note != 9 && note != 90)
        return [note % 10 - 1 - this.gridOffset[0], 9 - Math.floor(note / 10)  - this.gridOffset[1]]
      return [NaN, NaN];
    },

    specialLED: [8, -1],

    initializationSysex:[
        [0, 32, 41, 2, 13, 14, 1], //Enter Programmer Mode
    ],
}

export default config;
