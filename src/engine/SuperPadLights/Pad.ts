import type { Canvas, KeyID } from "../ProjectRT";
import Animation from "./Animation";

import howler from 'howler';
const Howl = howler.Howl;
const Howler = howler.Howler;

export class Pad {
    //Meta
    canvas:Canvas;
    behaviour:number;
    color:string;
    group: number;

    //Sound
    sound:Sound;

    //Animation
    animation: Animation | undefined;
    currentOn:{[signature: string]: KeyID} = {};

    constructor(canvas:Canvas, sound: Sound, behaviour:number, color:string, lights:object, group:number) 
    {
        this.canvas = canvas;
        this.behaviour = behaviour;
        this.color = color;
        this.group = group;
        this.sound = sound;
        this.animation = lights ? new Animation(lights, this.sound.howl.duration(), canvas) : undefined;
    }

    KeyPress() 
    {
        // console.log("Pad Pressed");
        if(this.sound)
        {
            if(this.sound.howl._loop && this.sound.howl.playing())
            {
                this.sound.stop();
            }
            else
            {
                this.sound.play();
            }
        }

        if(this.animation)
        {
            this.animation.play();
        }
    }

    KeyRelease()
    {
        // console.log("Pad Released");
    }
}

export class Sound {
    static index = 0;
    howl?: Howl;

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
        onloaderror: Sound.howlerLoadError,
        onplayerror: Sound.howlerPlayError
        });
    }

    play(loop = false)
    {
        this.howl._loop = loop;
        this.howl?.stop();
        this.howl?.play();
    }

    stop() { //Force stop
        this.howl?.stop();
    }

    static howlerLoadError(id:any, message:any){
        console.error(`Howler Load Error ${id} ${message}`);
    }

    static howlerPlayError(id:any, message:any){
        console.error(`Howler LoPlayad Error ${id} ${message}`);
    }
}
  