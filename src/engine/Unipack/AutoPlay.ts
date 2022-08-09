class AutoPlay {
    canvas = undefined;
    project = undefined;
    autoplay = undefined;
    playing = false;
    status = "STOPPED"
    progress = 0
    total = 0
    currentChain = 0
    lastEventTime = undefined;
  
    led = true;
    highlight = false;
    highlightColor = "#00FFFF"
  
    constructor(text, canvas, project) {
      this.autoplay = text;
      this.total = text === undefined ? 0 : text.length;
      this.canvas = canvas;
      this.project = project;
    }
  
    Start = async (callback) => {
      this.playing = true;
      // console.time("Autoplay")
      if (this.progress === 0) {
        // this.canvas.clear();
        this.currentChain = 0;
      }
      else
      {
        this.syncChain();
      }

      let deviceInfo = this.canvas.getDevices()[0];
      this.status = "PLAYING"
      this.lastEventTime = Date.now()
      for (this.progress; this.progress < this.autoplay.length; this.progress++) {
        // console.timeEnd("Autoplay");
        // console.time("Autoplay")
  
        if (this.status != "PLAYING") {
          return;
        }
  
        // console.log(this.autoplay[this.progress])
        let command = this.autoplay[this.progress].split(" ");
  
        if(callback !== undefined)
          callback([this.progress, this.autoplay.length])
  
        if (command.length < 2)
          continue;
  
        if (this.project.currentChain != this.currentChain) {
          this.project.ChainChange(this.currentChain);
        }
  
        switch (command[0]) {
          case 'o':
          case 'on':
            this.project.KeyPress(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
            // if(this.highlight)
            // {
            //   this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1, this.highlightColor)
            // }
            break;
          case 'f':
          case 'off':
            this.project.KeyRelease(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
            // if(this.highlight)
            // {
            //   this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1)
            // }
            break;
          case 't':
          case 'touch':
                this.project.KeyPress(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
                this.project.KeyRelease(deviceInfo, [parseInt(command[2]) - 1, parseInt(command[1]) - 1])
              // if(this.highlight)
              // {
              //   this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1, this.highlightColor)
              //   setTimeout(() => {this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1)}, 200)
              // }
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
            this.currentChain = parseInt(command[1]) - 1;
            // if(this.highlight)
            //   {
            //     this.canvas.setHighlight("chain", parseInt(command[1]) - 1, this.highlightColor)
            //     setTimeout(() => {this.canvas.setHighlight("chain", parseInt(command[1]) - 1)}, 200)
            //   }
            break;
          default:
        }
      }
      this.stop();
    }
  
    Pause() {
      this.playing = false;
      this.status = "PAUSED"
    }
  
    stop() {
      this.playing = false;
      this.status = "STOPPED"
      this.progress = 0
    }
  
    Next()
    {
      if(this.status == "PAUSED")
      {
  
      }
    }

    Previous()
    {
      if(this.status == "PAUSED")
      {
        
      }
    }
  
    Seek(position:number)
    {
  
    }
  
    syncChain()
    {
      for(var progress = this.progress; progress >= 0; progress--)
      {
        let command = this.autoplay[this.progress].split(" ");
        if(command == "c" || command == "chain")
        {
          this.project.ChainChange(parseInt(command[1]) - 1);
          this.currentChain = parseInt(command[1]) - 1;
          return;
        }
      }
      this.project.ChainChange(0);
      this.currentChain = 0;
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