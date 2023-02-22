import type { Canvas, KeyID } from "../ProjectRT";
import KeyLED from "./KeyLED";
import { KeySound } from "./KeySound";
import type UnipackRT from "./UnipackRT";
import { ColorType, Color } from "../../types/color";
import { Api } from "carbon-icons-svelte";


class AutoPlay {
    canvas:Canvas;
    project:UnipackRT;
    autoplay:string[];
    playing = false;
    status = "STOPPED";
    total:number;
    progress = 0;
    lastEventTime = 0;
  
    led = true;
    highlight = false;
    highlightColor = "#00FFFF"

    sections = [[0, 0]];

    thread_id = 0;

    layer = 0;
  
    constructor(text:string[], canvas:Canvas, project:UnipackRT) {
      this.autoplay = text;
      this.canvas = canvas;
      this.project = project;
      
      this.total = text === undefined ? 0 : text.length;

      //generate split
      for(let index = 0; index < this.total; index++)
      {
        let command = this.getCommand(index);
        if(command.length == 0) continue;
        if(command[0] === "chain")
        {
          this.sections.push([parseInt(command[1]) - 1, index]);
        }
      }
    }

    getCommand(index: number): string[]
    {
      if(index < 0)
      return [];

      let raw_command = this.autoplay?.[index];
      if(!raw_command)
        return [];

      let command = raw_command.split(" ");
      if (command.length < 2)
          return [];
      switch (command[0]) {
        case 'o':
          command[0] = "on";
          break;
        case 'f':
          command[0] = "off";
          break;
        case 't':
          command[0] = "touch";
          break;
        case 'd':
          command[0] = "delay";
          break;
        case 'c':
          command[0] = "chain";
          break;
      }
      return command;
    }
  
    Start = async () => {
      this.Pause();
      
      this.playing = true;
      // console.time("Autoplay")
      if (this.progress === 0) {
        // this.canvas.clear();
        this.project.LayerChange(0);
      }
      else
      {
        this.Seek(this.progress);
      }

      var local_id = ++this.thread_id;

      this.status = "PLAYING"
      this.lastEventTime = Date.now()
      for (this.progress; this.progress < this.total; this.progress++) {
        if (this.status != "PLAYING" || this.thread_id != local_id) {
          return;
        }
  
        // console.log(this.autoplay[this.progress])

        if(this.project.currentLayer != this.layer) {
          this.project.LayerChange(this.layer);
        }
  
        var command = this.getCommand(this.progress);
        if(command.length > 0) await this.executeCommand(command);
      }
      this.Stop(false);
    }

    async executeCommand(command: any[])
    {
      // console.log(command)
      let deviceInfo = this.canvas.getDevices()[0];
      switch (command[0]) {
        case 'o':deviceInfo
        case 'on':
          {
            const keyID:KeyID =  [parseInt(command[2]) - 1, parseInt(command[1]) - 1];
            this.project.KeyPress(deviceInfo, keyID)
            if(this.canvas.options.showKeyPress) {this.canvas.setOverlay(0, keyID)}
            break;
          }
        case 'f':
        case 'off':
          {
            const keyID:KeyID =  [parseInt(command[2]) - 1, parseInt(command[1]) - 1];
            this.project.KeyRelease(deviceInfo, keyID)
            if(this.canvas.options.showKeyPress) {this.canvas.unsetOverlay(0, keyID)}
            break;
          }
        case 't':
        case 'touch':
            {
              const keyID:KeyID =  [parseInt(command[2]) - 1, parseInt(command[1]) - 1];
              this.project.KeyPress(deviceInfo, keyID)
              this.project.KeyRelease(deviceInfo, keyID)
              if(this.canvas.options.showKeyPress)
              {   
                  this.canvas.setOverlay(0, keyID);
                  this.wait(200)!.then(() => {
                  this.canvas.unsetOverlay(0, keyID)});
              }
              break;
            }
        case 'd':
        case 'delay':
          var ms = parseInt(command[1])
          if(ms < 10)
            break;
          var adjusted_ms = this.lastEventTime + ms - Date.now()
          this.lastEventTime += ms
          await this.wait(adjusted_ms);
          break;
        case 'c':
        case 'chain':
          var new_layer = parseInt(command[1]) - 1;
          this.layer = new_layer;
          this.project.LayerChange(new_layer);
          if(this.canvas.options.showKeyPress)
          {
              const keyID:KeyID = ['c', parseInt(command[1]) - 1];
              this.canvas.setOverlay(0, keyID);
              this.wait(200)!.then(() =>{
              this.canvas.unsetOverlay(0, keyID);
            });
          }
          break;
        default:
      }
    }
  
    Pause(fullStop = true) {
      this.playing = false;
      this.status = "PAUSED"
      if(fullStop)
      {
        KeyLED.stopAll();
        KeySound.stopAll();
      }
      if(this.canvas.options.showKeyPress)
      {
        this.showActionKeys();
      }
    }
  
    Stop(fullStop = true) {
      console.log("Autoplay Stopped")
      this.playing = false;
      this.status = "STOPPED"
      this.progress = 0;
      this.project.LayerChange(0);
      this.project.clearKeypressHistory();
      if(fullStop)
      {
        KeyLED.stopAll();
        KeySound.stopAll();
      }
      if(this.canvas.options.showKeyPress)
      {
        this.showActionKeys();
      }
    }
  
    Next(justLayer:boolean = false)
    {
      while(true)
      {
        let command = this.getCommand(++this.progress);
        if(command.length == 0) continue;
        if(command[0] === "on" || command[0] === "touch") break;
        if(!justLayer)
        {
          this.executeCommand(command);
        }
        else
        {
          if(command[0] === "chain") 
          { 
            this.layer = parseInt(command[1]) - 1;
            this.project.LayerChange(parseInt(command[1]) - 1);
          }
        }
      }
      console.log(`Forward seek to ${this.progress}`)

      if(this.canvas.options.showKeyPress)
      {
        this.showActionKeys();
      }
    }

    Previous()
    {
      console.log(`Back seek from ${this.progress}`)
      this.Pause();
      let command = this.getCommand(this.progress);
      while(true)
      {
        if(this.progress <= 1) {this.progress = 0; break;}
        
        var prev_command = this.getCommand(--this.progress);
        if(prev_command.length == 0) continue;
        let new_command = command;
        command = prev_command;

        if((command[0] !== "on" && command[0] !== "touch") && (new_command[0] === "on" || new_command[0] === "touch") )
        {
          console.log(`Back seek to ${--this.progress}`)
          break;
        }
      }

      if(this.canvas.options.showKeyPress)
      {
        this.showActionKeys();
      }
    }
  
    Seek(target: number = this.progress)
    {
      var resumeAfterSeek = false;
      if(this.status === "PLAYING")
      {
        resumeAfterSeek = true;
      }

      this.Stop();
      console.log(`Seeking to ${target}`)
      // console.log(this.sections)
      let targetLayer = 0;
      let progress = 0;
      for(let section of this.sections)
      {
        if(target <= section[1]) break;
        targetLayer = section[0];
        progress = section[1];
      }

      console.log(`Seeking from layer ${targetLayer} at target ${progress}`)
      this.project.LayerChange(targetLayer);
      this.layer = targetLayer;
      this.project.clearKeypressHistory();

      let command = this.getCommand(progress);
      while(true)
      {
        //Check if overflow
        if(progress >= this.total)
        {
          this.stop();
          break;
        }

        //Check if condiction met (after target, last event was not on or touch, next event is on or touch)
        let old_command = command;
        command = this.getCommand(++progress);
        if(command.length == 0)
          continue;

        if(progress >= target && (old_command?.[0] !== "on" && old_command?.[0] !== "touch") && (command?.[0] === "on" || command?.[0] === "touch") )
          break;
        
        // console.log(`Seeking ${progress}`)
        if(command[0] == "off" || command[0] == "touch" || command[0] == "touch")
        {
          this.project.logKeypressHistory(parseInt(command[2]) - 1, parseInt(command[1]) - 1)
        }

      }
      this.progress = progress;
      console.log(`Seeked to ${progress}`)

      if(this.canvas.options.showKeyPress)
      {
        this.showActionKeys();
      }

      if(resumeAfterSeek)
      {
        this.Start();
      }
    }

    showActionKeys()
    {
      this.canvas.clearOverlay();
      for(let key of this.getActionKeys())
      {
        this.canvas.setOverlay(0, key);
      }
    }

    getActionKeys(start:number = this.progress): KeyID[]
    {
      let actionKeys:KeyID[] = [];
      while(true)
      {
        let command = this.getCommand(start++);
        // console.log(`Action Key (Pre) - Command ${start} ${command[0]}`)
        if(command.length == 0) continue;
        if(command[0] !== "delay" && command[0] !== "off") break;
      }
      start--;
      while(true)
      {
        let command = this.getCommand(start++);
        // console.log(`Action Key - Command ${start} ${command[0]}`)
        if(command.length == 0) continue;
        if(command[0] === "delay") break;
        if(command[0] === "on" || command[0] === "touch")
        {
          actionKeys.push( [parseInt(command[2]) - 1, parseInt(command[1]) - 1]);
          break;
        }
        if(command[0] === "chain") 
        {
          actionKeys.push(['c', parseInt(command[1]) - 1]);
          break;
        }
      }
      // console.log(actionKeys)
      return actionKeys;
    }
  
    wait(ms: number) 
    {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
  
  export default AutoPlay;