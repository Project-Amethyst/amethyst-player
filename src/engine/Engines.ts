import type { ProjectRT } from "./ProjectRT";
import UnipackRT from "./Unipack/UnipackRT";

export let projectEngines : {[name:string]: {(api:object):ProjectRT};} = {
  "Unipack": (api:object) => {return new UnipackRT(api);}
};
