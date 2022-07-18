import LaunchpadProMk2 from "./LaunchpadProMk2.svelte";
import LaunchpadMk2 from "./LaunchpadMk2.svelte";
import LaunchpadX from "./LaunchpadX.svelte";
import LaunchpadProMk3 from "./LaunchpadProMk3.svelte";
import Matrix from "./Matrix.svelte";


export let virtualDeviceComponents = [
  { component: LaunchpadProMk2 },
  { component: LaunchpadMk2 },
  { component: LaunchpadX },
  { component: LaunchpadProMk3 },
  { component: Matrix }
] as const;


