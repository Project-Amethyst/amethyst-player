import {KeyType} from "../types/devices";
import type {DeviceKeyID, GridDeviceConfig } from "../types/devices";


const config: GridDeviceConfig = {
    name: "Launchpad MK2",
    midiNameRegex: "Launchpad MK2",

    paletteChannel: {
      "classic": 1
    },

    keymap: [
      [[KeyType.CC, 104], [KeyType.CC, 105], [KeyType.CC, 106], [KeyType.CC, 107], [KeyType.CC, 108], [KeyType.CC, 109], [KeyType.CC, 110], [KeyType.CC, 111], NaN],
      [81, 82, 83, 84, 85, 86, 87, 88, 89],
      [71, 72, 73, 74, 75, 76, 77, 78, 79],
      [61, 62, 63, 64, 65, 66, 67, 68, 69],
      [51, 52, 53, 54, 55, 56, 57, 58, 59],
      [41, 42, 43, 44, 45, 46, 47, 48, 49],
      [31, 32, 33, 34, 35, 36, 37, 38, 39],
      [21, 22, 23, 24, 25, 26, 27, 28, 29],
      [11, 12, 13, 14, 15, 16, 17, 18, 19]],
    
    dimension: [10, 10],
    gridDimension: [8, 8],
    gridOffset: [1, 1],
    chainKey: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7],
                [-1, 7], [-1, 6], [-1, 5], [-1, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]],

    noteToXY(note)
    {
      if(note >= 11 && note <= 89)
      {
        return [(note % 10) - 1, 9 - Math.floor(note / 10)]
      }
      else if(note >= 104 && note <= 111)
      {
        return [note - 104, 0];
      }
      return [NaN, NaN]
    },
}

export default config;
