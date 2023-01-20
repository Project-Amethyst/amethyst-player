<script lang="ts">
    import type {KeyID} from "../../types/devices";
    import type { ColorType, Color } from "../../types/color"

    var div: HTMLDivElement;
    export function set_color(color: Color)
    {
      div.style.backgroundColor = color.rgb_str();
    }
</script>

<div class={$$props.class} style={$$props.style} bind:this={div}>
  <slot>
  </slot>
</div>

<style>
</style>