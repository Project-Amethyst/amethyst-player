import KeyLED from "./KeyLED";
import { KeySound } from "./KeySound";

class AutoPlay {
    canvas = undefined;
    project = undefined;
    autoplay = undefined;
    playing = false;
    status = "STOPPED"
    progress = 0
    total = 0
    lastEventTime = undefined;

    activeKeys = [];
  
    led = true;
    highlight = false;
    highlightColor = "#00FFFF"

    sections = [[0, 0]];

    thread_id = 0;
  
    constructor(text, canvas, project) {
      this.autoplay = text;
      this.total = text === undefined ? 0 : text.length;
      this.canvas = canvas;
      this.project = project;

      //generate split
      for(let index = 0; index < this.autoplay.length; index++)
      {
        let command = this.getCommand(index);
        if(!command) continue;
        if(command[0] === "chain")
        {
          this.sections.push([parseInt(command[1]) - 1, index]);
        }
      }
    }

    getCommand(index: number): [] | undefined
    {
      if(index < 0)
      return undefined;

      let raw_command = this.autoplay?.[index];
      if(!raw_command)
        return undefined;

      let command = raw_command.split(" ");
      if (command.length < 2)
          return undefined;
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
  
    Start = async (callback) => {
      this.playing = true;
      // console.time("Autoplay")
      if (this.progress === 0) {
        // this.canvas.clear();
        this.project.ChainChange(0);
      }
      else
      {
        this.Seek(this.progress);
      }

      var local_id = ++this.thread_id;

      this.status = "PLAYING"
      this.lastEventTime = Date.now()
      for (this.progress; this.progress < this.autoplay.length; this.progress++) {
        // console.timeEnd("Autoplay");
        // console.time("Autoplay")
  
        if (this.status != "PLAYING" || this.thread_id != local_id) {
          return;
        }
  
        // console.log(this.autoplay[this.progress])
        if(callback !== undefined)
          callback([this.progress, this.autoplay.length])
  
        var command = this.getCommand(this.progress);
        if(command) await this.executeCommand(command);
      }
      this.stop(false);
    }

    async executeCommand(command: any[])
    {
      let deviceInfo = this.canvas.getDevices()[0];
      switch (command[0]) {
        case 'o':
        case 'on':
          this.project.KeyPress(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
          break;
        case 'f':
        case 'off':
          this.project.KeyRelease(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
          break;
        case 't':
        case 'touch':
              this.project.KeyPress(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
              this.project.KeyRelease(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
            break;
        case 'd':
        case 'delay':
          var ms = parseInt(command[1])
          if(ms < 10)
            break;
          await this.wait(parseInt(command[1]));
          break;
        case 'c':
        case 'chain':
          this.project.ChainChange(parseInt(command[1]) - 1);
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
    }
  
    stop(fullStop = true) {
      this.playing = false;
      this.status = "STOPPED"
      this.progress = 0;
      this.project.ChainChange(0);
      this.project.clearKeypressHistory();
      if(fullStop)
      {
        KeyLED.stopAll();
        KeySound.stopAll();
      }
    }
  
    Next()
    {
      this.Pause();
      while(true)
      {
        let command = this.getCommand(this.progress++);
        if(!command) continue;
        if(command[0] === "delay") break;
        this.executeCommand(command);
      }
      console.log(`Forward seek to ${this.progress}`)
    }

    Previous()
    {
      console.log(`Back seek from ${this.progress}`)
      this.Pause();
      let command = this.getCommand(this.progress);
      while(true)
      {
        console.log(this.progress);
        if(this.progress <= 1) {this.progress = 0; break;}

        let new_command = command;
        command = this.getCommand(--this.progress);
        if(!command) continue;

        if((command?.[0] !== "on" || command?.[0] === "touch") && (new_command?.[0] === "on" || new_command?.[0] === "touch") )
        {
          console.log(`Back seek to ${--this.progress}`)
          break;
        }
      }
    }
  
    Seek(target:number)
    {
      this.Pause();
      console.log(`Seeking to ${target}`)
      // console.log(this.sections)
      let targetChain = 0;
      let progress = 0;
      for(let section of this.sections)
      {
        if(target <= section[1]) break;
        targetChain = section[0];
        progress = section[1];
      }

      this.project.ChainChange(targetChain);
      this.project.clearKeypressHistory();

      let command = this.getCommand(progress);
      while(true)
      {
        //Check if overflow
        if(progress >= this.autoplay.length)
        {
          this.stop();
          break;
        }

        //Check if condiction met (after target, last event was not on or touch, next event is on or touch)
        let old_command = command;
        command = this.getCommand(++progress);
        if(!command)
          continue;

        if(progress >= target && (old_command?.[0] !== "on" || old_command?.[0] === "touch") && (command?.[0] === "on" || command?.[0] === "touch") )
          break;
        
        // console.log(`Seeking ${progress}`)
        if(command[0] == "off" || command[0] == "touch" || command[0] == "touch")
        {
          this.project.logKeypressHistory(parseInt(command[2]) - 1, parseInt(command[1]) - 1)
        }
      }
      this.progress = progress;
      console.log(`Seeked to ${progress}`)
    }
  
    wait(ms) {
      var adjusted_ms = this.lastEventTime + ms - Date.now()
      this.lastEventTime += ms
      if(adjusted_ms > 5)
      {
        return new Promise(resolve => setTimeout(resolve, adjusted_ms))
      }
      else
      {
        return 
      }
    }
  }
  
  export default AutoPlay;