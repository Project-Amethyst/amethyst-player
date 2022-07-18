import type { ProjectRT } from "./ProjectRT";
import UnipackRT from "./Unipack/UnipackRT";

export let projectEngines : {[name:string]: {():ProjectRT};} = {
  "Unipack": () => {return new UnipackRT;}
};
