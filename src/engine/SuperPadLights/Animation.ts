import { ColorType, Color } from "../../types/color";
import type { Canvas, KeyID } from "../ProjectRT";

class Animation
{
  data:object;
  end:boolean = false;
  length:number;
  frameLengthMS: number;
  canvas:Canvas;
  currentOn:{[signature: string]: KeyID} = {};

  lastEventTime?:number;

  static active:Animation|undefined;
  static id = 0;

  local_id:number = -1;

  constructor(data:object, soundLength: number, canvas: Canvas)
  {
    this.data = data;
    this.length = data["LED"]["anim"].length;
    this.frameLengthMS = soundLength * 1000 / this.length;
    this.canvas = canvas;
  }

  play = async() =>
  {
    var local_id = ++Animation.id;
    console.log(Animation.active);
    Animation.active?.stop();
    this.end = false;
    Animation.active = this;
    console.log(Animation.active);
    this.lastEventTime = Date.now()
    // console.log(`Animation Playing - ${this.local_id}`)
    // console.timeLog("KeyOn")
    console.log(this.data["LED"]["anim"])
    for(var frame = 0; frame < this.length; frame++)
    {
        if(Animation.id != local_id)
        {
        //   console.log(`Stopped - ${this.local_id}`)
          return;
        }

        // console.log(`Frame ${frame}`)
        for(var index = 0; index < this.data["LED"]["anim"][frame].length; index++)
        {
            let keyID: KeyID = [(this.data["LED"]["anim"][frame][index] - 1) % 8, Math.floor((this.data["LED"]["anim"][frame][index] - 1) / 8)]
            let colorInt: number = this.data["LED"]["color"][frame][index];
            let [a, r, g, b] = [
                colorInt >> 24,
                (colorInt & 0xFF0000) >> 16,
                (colorInt & 0xFF00) >> 8,
                colorInt & 0xFF
            ];
            // console.log(`Set Color ${keyID[0]}-${keyID[1]} : ${[r, g, b]}`)
            this.canvas.setColor(0, keyID, new Color(ColorType.RGB, [r, g, b]));

            let id_str = keyID.toString();
            if(this.currentOn[id_str] === undefined) 
            {
                this.currentOn[id_str] = keyID;
            }
        }
        
        await this.wait(this.frameLengthMS);
        this.clearLight();
      }

    this.stop();
  }

  wait(ms)
  {
    // console.log(`Delay for ${ms}ms`)
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
    // console.log(`Stop! - ${this.local_id}`)
    this.end = true;
    if(Animation.active === this)
    {
        if(clearLight)
        {
            this.clearLight();
        }
        Animation.active = undefined;
    }
    this.currentOn = {};
  }

  clearLight()
  {
    for(var id in this.currentOn)
    {
        var keyID = this.currentOn[id]
        this.canvas.setColor(0, keyID, new Color(ColorType.Palette, ["classic", 0]));
    }
    this.currentOn = {};
  }
}

export default Animation;