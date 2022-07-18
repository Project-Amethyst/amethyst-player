class KeyLED
{
  keyLED = undefined
  id = undefined
  id_str = undefined
  repeat = 1;
  end = false;
  activeThread = -1
  nextID = 0
  canvas = undefined
  currentOn=[]
  lastEventTime = undefined;
  activeList = undefined //Global, refence to the activeKeyLED object in the projectFile

  constructor(text, repeat, canvas, id, activeList)
  {
    this.keyLED = text;
    this.repeat = repeat;
    this.canvas = canvas;
    this.id = id;
    this.id_str = `${id[0]} ${id[1]} ${id[2]} ${id[3]}` 
    this.activeList = activeList
  }

  play = async() =>
  {
    if(this.activeList[this.id_str] === undefined)
    {
      this.activeList[this.id_str] = this.id
      // console.log("Active List added")
      // console.log(this.activeList)
    }
    var threadID = this.getID()
    this.activeThread = threadID
    this.currentOn = []
    var currentLoop = 0
    this.end = false;
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
              if(command[1] === "*")
              {
                command[1] = "mc"
              }
              if(command[1] === "mc" || command[1] === "l") //For "l", the y is garbage but it won't be read for the setColor functions so just gonna let it be
              {
                [x, y] = [command[1], parseInt(command[2] - 1)]
              }
              else if(parseInt(command[1]) !== NaN)
              {
                [x, y] = [parseInt(command[2] - 1), parseInt(command[1] - 1)]
              }

              var color
              if(command[command.length - 2] === "a" || command[command.length - 2] === "auto")
              {
                color = parseInt(command[command.length - 1])
              }
              else
              {
                color = "#" + command[command.length - 1]
              }

              this.canvas.setColor(x, y, color)

              var id = x + "-" + y
              if(this.currentOn[id] === undefined) 
              {
                this.currentOn[id] = [x, y]
              }
              else if(color === 0)
              {
                delete this.currentOn[id]
              }
              break;
          case 'f': //color off
          case 'off': //color off
            var [x, y] = [undefined, undefined]
            if(command[1] === "*")
            {
              command[1] = "mc"
            }
            if(command[1] === "mc" || command[1] === "l")
            {
              [x, y] = [command[1], parseInt(command[2] - 1)]
            }
            else if(parseInt(command[1]) !== NaN)
            {
              [x, y] = [parseInt(command[2] - 1), parseInt(command[1] - 1)]
            }

            this.canvas.setColor(x, y, 0)
            var id = x + "-" + y
            delete this.currentOn[id]
            break;
          case 'd': //wait
          case 'delay': 
          await this.wait(parseInt(command[1]));
            break;
          default:
        }
      }
      if(this.end)
      {
        this.stop()
        break;
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
      return 
    }
  }

  getID()
  {
    return this.nextID++;
  }

  stop(clearLight = true)
  { 
    //Threading System (Light 1 in delay then we set it to stop and create a Light 2 so it can start right away, set )
    if(this.activeThread === -1)
      return
    this.activeThread = -1
    if(clearLight)
    {
      for(var id in this.currentOn)
      {
        var [x,y] = this.currentOn[id]
        this.canvas.setColor(x, y, 0)
      }
    }
    this.currentOn = []
    this.removeFromActiveList()
  }

  endLoop()
  {
    this.end = true
  }

  removeFromActiveList()
  {
    // console.log("Try to delete " + this.id_str)
    // console.log(this.activeList)
    delete this.activeList[this.id_str]
    // console.log(this.activeList)
  }
}

export default KeyLED;