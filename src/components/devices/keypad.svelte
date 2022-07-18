<script lang="ts">
    import type {KeyID, KeyPress, KeyRelease } from "../../types/devices";

    export let id: KeyID;
    let active:boolean = false;
    export let keyPress: KeyPress;
    export let keyRelease: KeyRelease;
    let color = 'rgb(0, 0, 0)';
    var button: HTMLButtonElement;
    export function set_color(r:number, g:number, b:number)
    {
      // console.log(styles);
      button.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
</script>

<button class={$$props.class} style={$$props.style} bind:this={button}
  on:mousedown={() => {
    // console.log(`${id} clicked`)
    active = true;
    keyPress(id);
  }}
  on:mouseup={() => {
    // console.log(`${id} released`)
    active = false;
    keyRelease(id);
  }}
  on:mouseleave={() => {
    if(active)
    {
      // console.log(`${id} released`)
      active = false;
      keyRelease(id);
    }
  }}>
</button>

<style>
</style>