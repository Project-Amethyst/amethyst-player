import { ColorType, Color } from "../../types/color";
import type { Canvas, KeyID } from "../ProjectRT";
import {rawPalette as palette} from "./palette"

class KeyLED
{
  id:number;
  keyLED:string[];
  repeat:number;
  canvas:Canvas;
  currentOn:{[signature: string]: KeyID} = {};

  lastEventTime?:number;
  activeThread:number = -1;
  latestThread:number = 0;

  static activeList:KeyLED[] = [];
  static registered_count = 0;

  static mc_lut: KeyID[] = [[0, -1], [1, -1], [2, -1], [3, -1], [4, -1], [5, -1], [6, -1], [7, -1],
                            [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7],
                            [7, 8], [6, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
                            [-1, 7], [-1, 6], [-1, 5], [-1, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]]

  constructor(text:string[], repeat: number, canvas: Canvas)
  {
    this.keyLED = text;
    this.repeat = repeat;
    this.canvas = canvas;
    this.id = KeyLED.registered_count++;
  }

  play = async() =>
  {
    this.stop();
    this.addToActiveList();
    var threadID = ++this.latestThread;
    this.activeThread = threadID;
    var currentLoop = 0
    this.lastEventTime = Date.now()
    // console.log("KeyLED")
    // console.timeLog("KeyOn")
    while(this.repeat === 0 || currentLoop++ < this.repeat)
    {
      for(var line of this.keyLED)
      {
        line = line.trim()
        if(this.activeThread != threadID)
          return

        if(line == "")
          continue;
        
        let command = line.split(" ");
        // console.log(line)

        switch(command[0])
        {
          case 'o': //set color
          case 'on': //set color
              var keyID: KeyID | undefined;
              if(command[1] === "*" || command[1] === "mc")
              {
                keyID = KeyLED.mc_lut[parseInt(command[2]) - 1]
              }
              else if(command[1] === "l")
              {
                continue;
                // keyID = 0;
              }
              else if(!isNaN(parseInt(command[1])))
              {
                keyID = [parseInt(command[2]) - 1, parseInt(command[1]) - 1]
              }

              var color: Color | undefined;
              if(command[command.length - 2] === "a" || command[command.length - 2] === "auto")
              {
                var index:number = parseInt(command[command.length - 1])
                color = new Color(ColorType.Palette, ["classic", index])
              }
              else
              {
                var r:number = parseInt(command[command.length - 1].substring(0, 2), 16)
                var g:number = parseInt(command[command.length - 1].substring(2, 4), 16)
                var b:number = parseInt(command[command.length - 1].substring(4, 6), 16)
                color = new Color(ColorType.RGB, [r, g, b]);
              }
              
              if(keyID != undefined && color != undefined)
              {
                this.canvas.setColor(0, keyID, color);
      
                let id_str = keyID.toString();
                if(this.currentOn[id_str] === undefined) 
                {
                  this.currentOn[id_str] = keyID;
                }
                else if(color?.index() === 0)
                {
                  delete this.currentOn[id_str];
                }
              }
              break;
          case 'f': //color off
          case 'off': //color off
            var keyID: KeyID;
            if(command[1] === "*" || command[1] === "mc") 
            {
              keyID = KeyLED.mc_lut[parseInt(command[2]) - 1]
            }
            else if(command[1] === "l")
            {
              continue;
              // keyID = 0;
            }
            else if(!isNaN(parseInt(command[1])))
            {
              keyID = [parseInt(command[2]) - 1, parseInt(command[1]) - 1]
            }
            
            if(keyID != undefined)
            {
              this.canvas.setColor(0, keyID, new Color(ColorType.Palette, ["classic", 0]));
              
              let id_str = keyID.toString();
              if(this.currentOn[id_str] !== undefined) 
              {
                delete this.currentOn[id_str];
              }
            }
            break;
          case 'd': //wait
          case 'delay': 
          await this.wait(parseInt(command[1]));
            break;
          default:
        }
      }
    }
    if(this.activeThread == threadID) //Added due to current thread on the last wait then the next thread started. This will result in the next thread to be stuck
    {
      this.activeThread = -1
      this.removeFromActiveList()
    }
  }

  wait(ms)
  {
    var adjusted_ms = this.lastEventTime + ms - Date.now()
    this.lastEventTime += ms
    if(adjusted_ms > 5)
    {
      return new Promise(resolve => setTimeout(resolve, adjusted_ms))
    }
    else
    {
      return;
    }
  }

  stop(clearLight = true)
  { 
    //Threading System (Light 1 in delay then we set it to stop and create a Light 2 so it can start right away, set )
    // if(this.activeThread === -1)
    //   return
    this.activeThread = -1
    if(clearLight)
    {
      for(var id in this.currentOn)
      {
        var keyID = this.currentOn[id]
        this.canvas.setColor(0, keyID, new Color(ColorType.Palette, ["classic", 0]));
      }
    }
    this.currentOn = {};
    this.removeFromActiveList()
  }

  keyRelease()
  {
    if(this.repeat === 0)
    {
      this.stop();
    }
  }

  addToActiveList()
  {
    if(KeyLED.activeList.indexOf(this) === -1)
    {
      KeyLED.activeList.push(this);
    }
  }

  removeFromActiveList()
  {
    let index = KeyLED.activeList.indexOf(this);
    if(index !== -1)
    {
      KeyLED.activeList.splice(index, 1);
    }
  }

  static stopAll()
  {
    for(var active of KeyLED.activeList)
    {
      active.stop();
    }
    KeyLED.activeList = [];
  }
}

export default KeyLED;