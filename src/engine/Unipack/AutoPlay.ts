class AutoPlay {
    autoplay = undefined;
    status = "STOPPED"
    progress = 0
    total = 0
    currentChain = 0
    canvas = undefined;
    lastEventTime = undefined;
  
    led = true;
    highlight = false;
    highlightColor = "#00FFFF"
  
    constructor(text, canvas) {
      this.autoplay = text;
      this.total = text === undefined ? 0 : text.length;
      this.canvas = canvas;
    }
  
    play = async (callback) => {
      // console.time("Autoplay")
      if (this.progress === 0) {
        this.canvas.initlalizeCanvas();
        this.canvas.autoplay = this;
        this.currentChain = 0;
      }
      else
      {
        this.syncChain();
      }
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
  
        if (this.canvas.currentChain != this.currentChain) {
          this.canvas.chainChange(this.currentChain);
        }
  
        switch (command[0]) {
          case 'o':
          case 'on':
            this.canvas.keyOn(parseInt(command[2]) - 1, parseInt(command[1]) - 1, undefined, true, true, this.led);
            if(this.highlight)
            {
              this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1, this.highlightColor)
            }
            break;
          case 'f':
          case 'off':
            this.canvas.keyOff(parseInt(command[2]) - 1, parseInt(command[1]) - 1, undefined, true);
            if(this.highlight)
            {
              this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1)
            }
            break;
          case 't':
          case 'touch':
                this.canvas.keyOn(parseInt(command[2]) - 1, parseInt(command[1]) - 1, undefined, true, true, this.led);
                this.canvas.keyOff(parseInt(command[2]) - 1, parseInt(command[1]) - 1, undefined, true);
              if(this.highlight)
              {
                this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1, this.highlightColor)
                setTimeout(() => {this.canvas.setHighlight(parseInt(command[2]) - 1, parseInt(command[1]) - 1)}, 200)
              }
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
            this.canvas.chainChange(parseInt(command[1]) - 1);
            this.currentChain = parseInt(command[1]) - 1;
            if(this.highlight)
              {
                this.canvas.setHighlight("chain", parseInt(command[1]) - 1, this.highlightColor)
                setTimeout(() => {this.canvas.setHighlight("chain", parseInt(command[1]) - 1)}, 200)
              }
            break;
          default:
        }
      }
      this.stop();
    }
  
    pause() {
      this.status = "PAUSED"
    }
  
    stop() {
      this.status = "STOPPED"
      this.progress = 0
      this.canvas.autoplay = null;
    }
  
    backward()
    {
      if(this.status == "PAUSED")
      {
        
      }
    }
  
    forward()
    {
      if(this.status == "PAUSED")
      {
  
      }
    }
  
    seek(index)
    {
  
    }
  
    syncChain()
    {
      for(var progress = this.progress; progress >= 0; progress--)
      {
        let command = this.autoplay[this.progress].split(" ");
        if(command == "c" || command == "chain")
        {
          this.canvas.chainChange(parseInt(command[1]) - 1);
          this.currentChain = parseInt(command[1]) - 1;
          return;
        }
      }
      this.canvas.chainChange(0);
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