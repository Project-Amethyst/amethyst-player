// import {Howler, Howl} from "../../howler/howler.core";

import howler from 'howler';
const Howl = howler.Howl;
const Howler = howler.Howler;

import { browser } from '$app/environment';

export class KeySound {
  sound: Sound;
  loop?: number;
  wormhole?: number;
  sound_id?: number;
  constructor(sound: Sound, loop?:number, wormhole?:number)
  {
    this.sound = sound;
    this.loop = loop;
    this.wormhole = wormhole;
  }

  keyPress(): void
  {
    this.stop();
    this.sound_id = this.sound.play(this.loop);
  }

  keyRelease(): void
  {
    if(this.loop === 0)
    {
      this.sound.stop();
    }
  }

  stop(): void
  {
    this.sound.stop();
  }

  static stopAll()
  {
    Howler.stop();
  }
}

export class Sound {
  howl?: Howl;
  loopTarget:{[key: number]: number } = {};
  loopCounter:{[key: number]: number } = {};

  constructor(file:Blob, name: string) {
    // console.log(Howler.usingWebAudio)
    // console.log(file)
    let fileURL = window.URL.createObjectURL(new File([file], name)) //createObjectURL causes issue with GC
    let format = name.toLowerCase().split(".").pop()
    // console.log(this.format)
    // console.log(Howler.codecs(this.format))
    this.howl = new Howl({
      src: [fileURL],
      format: [format],
      // html5: !Howler.usingWebAudio,
      onend: this.onEnd.bind(this),
      onloaderror: Sound.howlerLoadError,
      onplayerror: Sound.howlerPlayError
    });
  }

  play(loop = 1): number { //Loop 0 means keep playing
    if(loop !== 1)
    {
      this.howl._loop = true;
    }

    var id = this.howl?.play()
    // console.log("KeySound")
    // console.timeLog("KeyOn")

    this.loopCounter[id] = 0
    this.loopTarget[id] = loop;

    return id;
  }

  stop(id?:number) { //Force stop ALL
    if(id)
    {
        this.howl?.stop(id)
        delete this.loopTarget[id];
        delete this.loopCounter[id];
    }
    else
    {
        this.howl?.stop()
        this.loopTarget = {};
        this.loopCounter = {}
    }
  }

  onEnd(id) {
    // console.log(`ID ${id} Loop #${this.loopCounter[id]} ended`)
    if (this.loopTarget[id] === 0 || ++this.loopCounter[id] < this.loopTarget[id])         // So if loopTarget is 0 then it will keep going
    { 
        return
    }
    this.howl._loop = false
    this.howl.stop(id)

  }

  static howlerLoadError(id:any, message:any){
    console.error(`Howler Load Error ${id} ${message}`)
  }

  static howlerPlayError(id:any, message:any){
    console.error(`Howler LoPlayad Error ${id} ${message}`)
  }
}
