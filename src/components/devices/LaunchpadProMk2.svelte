<svelte:options accessors/>
<script lang="ts">
    import type {KeyID, DeviceInfo} from "../../types/devices";
    import type {KeyPress, KeyRelease} from "../../engine/CanvasAPI"
    import { ColorType, Color } from "../../types/color"
    
    import Keypad from "../keypad.svelte";
    import Light from "../light.svelte";

    let keyPads: any[] = [];
    export let keyPress: KeyPress;
    export let keyRelease: KeyRelease;
    export let id:number;
    export let pos:[number, number];

    export var deviceInfo: DeviceInfo = 
    {
        dimension: [10, 10],
        grid_dimension: [8, 8],
        grid_offset: [1, 1],
        layer_key: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7],
                    [7, 8], [6, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
                    [-1, 7], [-1, 6], [-1, 5], [-1, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]],
        special_led: [8, 8]
    }

    /** Get the clip path for the middle pads. */
    function getCornerRadius (x: number, y: number) {
        switch (x + y * 10) {
            case 54:
                return "polygon(80% 0, 100% 20%, 100% 100%, 0 100%, 0 0)";

            case 55:
                return "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 20%)";

            case 44:
                return "polygon(100% 0, 100% 80%, 80% 100%, 0 100%, 0 0)";

            case 45:
                return "polygon(100% 0, 100% 100%, 20% 100%, 0 80%, 0 0)";
            
            default:
                return "unset";
        }
    }

    function getKeypadIndex(keyID: KeyID): number {
        if(Array.isArray(keyID))
        {
            if(keyID[0] === 'c') keyID = deviceInfo.layer_key[keyID[1]];
            return keyID[1] * 10 + keyID[0];
        }
        else
        {
            return keyID;
        }
    }

export function setColor(keyID: KeyID, color: Color) {
        if(Array.isArray(keyID))
        {
            if(keyID[0] === 'c') keyID = deviceInfo.layer_key[keyID[1]];
            else if(keyID[0] === 's' && keyID[1] === 0) keyID = deviceInfo.special_led;
            keyID = [
                keyID[0] + deviceInfo.grid_offset[0],
                keyID[1] + deviceInfo.grid_offset[1]
            ];
        }
        let index = getKeypadIndex(keyID)
        if(keyPads[index]) {
            var screen_color = color.overlay(new Color(ColorType.RGB, [80, 80, 80]));
            keyPads[index].set_color(screen_color);           
        }
    }
</script>

<div class="lp-border">
    <div class="lp-controls">
        {#each Array(10) as _, y}
            <div class="lp-controls-row">
                {#each Array(10) as _2, x}
                    <div class="lp-btn-parent">
                        {#if x === 0 && y === 0}
                            <Keypad class="lp-shift-btn" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                        {:else if  (x > 0 && x < 9) && (y > 0 && y < 9)}
                            <Keypad class="lp-normal-btn" style="clip-path: {getCornerRadius(x, y)};" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                        {:else if (x > 0 && x < 9) || (y > 0 && y < 9)}
                            <Keypad class="lp-side-btn" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                        {/if}

                    </div>
                {/each}
            </div>
        {/each}
    </div>
    <Light class="lp-mode-light" bind:this={keyPads[99]}>
    </Light>
</div>

<style lang="scss">
    .lp-border {
        background: rgb(20, 20, 20);
        border: 2px solid rgb(120, 120, 120);
        border-radius: 6%;

        position: relative;

        width: 100%;
        aspect-ratio: 1/1;
    }

    .lp-controls {
        height: 100%;
        width: 100%;

        display: flex;
        gap: 1.5%;
        flex-direction: column;

        padding: 4%;

        .lp-controls-row {
            height: 100%;
            display: flex;
            gap: 1.5%;
        }

        .lp-btn-parent {
            height: 100%;
            width: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            :global(.lp-side-btn) {
                padding: 0;
                border: none;

                height: 90%;
                width: 90%;
                border-radius: 50%;
                background-color: rgb(80, 80, 80);

                &::after {
                  content: "";
                  display: block;
                  box-sizing: border-box;

                  height: 100%;
                  width: 100%;
                  
                  padding: 6%;
                  background-clip: content-box;
                  background-color: rgb(10, 10, 10);
                  border-radius: 50%;
                }
            }

            :global(.lp-normal-btn) {
                border: none;

                height: 92%;
                width: 92%;
                border-radius: 10%;
                background-color: rgb(80, 80, 80);
            }

            :global(.lp-shift-btn) {
                padding: 0;
                border: none;

                height: 35%;
                width: 35%;
                border-radius: 50%;
                background-color: rgb(40, 40, 40);
            }

        }
    }

    :global(.lp-mode-light) {
        width: 3%;
        height: 3%;
        border-radius: 30% 30% 0 0;
        background-color: rgb(80, 80, 80);

        position: absolute;
        bottom: 0; left: 0; right: 0;
        margin: 0 auto;
    }
</style>
