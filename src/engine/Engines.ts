import type { ProjectRT } from "./ProjectRT";
import type {canvas} from "./CanvasAPI"
import UnipackRT from "./Unipack/UnipackRT";
import SuperPadLights from "./SuperPadLights/SuperPadLights"

export let projectEngines : {[name:string]: {(api:canvas):ProjectRT};} = {
  "Unipack": (api:canvas) => {return new UnipackRT(api);},
  "SuperPad Lights (Beta)": (api:canvas) => {return new SuperPadLights(api);}
};