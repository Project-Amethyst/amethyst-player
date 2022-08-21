import type { ProjectRT } from "./ProjectRT";
import type {canvas} from "./CanvasAPI"
import UnipackRT from "./Unipack/UnipackRT";
import ULP from "./ULP/ULP";

export let projectEngines : {[name:string]: {(api:canvas):ProjectRT};} = {
  "ULP": (api:canvas) => {return new ULP(api);},
  "Unipack": (api:canvas) => {return new UnipackRT(api);}
};
