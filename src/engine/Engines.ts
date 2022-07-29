import type { ProjectRT } from "./ProjectRT";
import type {canvas} from "./CanvasAPI"
import UnipackRT from "./Unipack/UnipackRT";

export let projectEngines : {[name:string]: {(api:canvas):ProjectRT};} = {
  "Unipack": (api:canvas) => {return new UnipackRT(api);}
};
