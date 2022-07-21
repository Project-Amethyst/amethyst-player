<script lang="ts">
    import type {KeyID} from "../../types/devices";
    import type {KeyPress, KeyRelease} from "../../engine/CanvasAPI"
    import type { ColorType, Color } from "../../types/color"

    export let deviceID: number;
    export let id: KeyID;
    let active:boolean = false;
    export let keyPress: KeyPress;
    export let keyRelease: KeyRelease;
    let color = 'rgb(0, 0, 0)';
    var button: HTMLButtonElement;
    export function set_color(color: Color)
    {
      // console.log(styles);  
      button.style.backgroundColor = color.rgb_str();
    }
</script>

<button class={$$props.class} style={$$props.style} bind:this={button}
  on:mousedown={() => {
    // console.log(`${id} clicked`)
    active = true;
    keyPress(deviceID, id);
  }}
  on:mouseup={() => {
    // console.log(`${id} released`)
    active = false;
    keyRelease(deviceID, id);
  }}
  on:mouseleave={() => {
    if(active)
    {
      // console.log(`${id} released`)
      active = false;
      keyRelease(deviceID, id);
    }
  }}>
</button>

<style>
</style>