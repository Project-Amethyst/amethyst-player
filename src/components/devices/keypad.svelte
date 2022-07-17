<script lang="ts">
    import type {KeyPress, KeyRelease } from "../../types/devices";

    export let id: number|[number, number];
    let active:boolean = false;
    // export let class_str: string;
    // export let style_str: string;
    // export let keyPress: KeyPress;
    // export let keyRelease: KeyRelease;
    // console.log("Hello")
</script>

<button class={$$props.class} style={$$props.style}
  on:mousedown={() => {
    console.log(`${id} clicked`)
    active = true;
  }}
  on:mouseup={() => {
    console.log(`${id} released`)
    active = false;
  }}
  on:mouseleave={() => {
    if(active)
    {
      console.log(`${id} released`)
      active = false;
    }
  }}>
</button>