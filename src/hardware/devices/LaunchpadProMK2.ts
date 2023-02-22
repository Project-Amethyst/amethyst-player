import {KeyType} from "../types/devices";
import type {DeviceKeyID, GridDeviceConfig } from "../types/devices";

const config: GridDeviceConfig = {
    name: "Launchpad Pro MK2",
    midiNameRegex: "Launchpad Pro",

    paletteChannel: {
      "classic": 1
    },

    keymap: [
      [NaN, 91, 92, 93, 94, 95, 96, 97, 98, [KeyType.Sysex, 99]],
      [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
      [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
      [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
      [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
      [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
      [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
      [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      [NaN, 1, 2, 3, 4, 5, 6, 7, 8, NaN]],
    
    dimension: [10, 10],
    gridDimension: [8, 8],
    gridOffset: [1, 1],
    layerKey: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7],
                [-1, 7], [-1, 6], [-1, 5], [-1, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]],
    noteToXY(note)
    {
      if(note >= 1 && note <= 99 && note != 9 && note != 90)
        return [note % 10 - this.gridOffset[0], 9 - Math.floor(note / 10)  - this.gridOffset[1]]
      return [NaN, NaN];
    },

    specialLED: [8, -1],

    initializationSysex:[
      [0, 32, 41, 2, 16, 33, 0], //Enter Live Mode
      [0, 32, 41, 2, 16, 14, 0], //Clear canvas
      [0, 32, 41, 2, 16, 10, 99, 0], //Turn off Mode light
    ],
}

export default config;
