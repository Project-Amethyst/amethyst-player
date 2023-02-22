<svelte:options accessors/>
<script lang="ts">
    import type {KeyID, DeviceInfo} from "../../types/devices";
    import type {KeyPress, KeyRelease} from "../../engine/CanvasAPI"
    import { ColorType, Color } from "../../types/color"
    
    import Keypad from "../keypad.svelte";

    let keyPads: any[] = [];
    export let keyPress: KeyPress;
    export let keyRelease: KeyRelease;
    export let id:number;
    export let pos:[number, number];

    export var deviceInfo: DeviceInfo = 
    {
        dimension: [8, 8],
        grid_dimension: [8, 8],
        grid_offset: [0, 0],
        layer_key: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], 
                    [-1, 7], [-1, 6], [-1, 5], [-1, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]]
    }
    /** Get the clip path for the middle pads. */
    function getCornerRadius (x: number, y: number) {
        switch (x + y * 10) {
            case 43:
                return "polygon(80% 0, 100% 20%, 100% 100%, 0 100%, 0 0)";

            case 44:
                return "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 20%)";

            case 33:
                return "polygon(100% 0, 100% 80%, 80% 100%, 0 100%, 0 0)";

            case 34:
                return "polygon(100% 0, 100% 100%, 20% 100%, 0 80%, 0 0)";

            default:
                return "unset";
        }
    }

    
    function getKeypadIndex(keyID: KeyID): number {
        if(Array.isArray(keyID))
        {
            if(keyID[0] === 'c') keyID = deviceInfo.layer_key[keyID[1]]
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
        {#each Array(8) as _, y}
            <div class="lp-controls-row">
                {#each Array(8) as _2, x}
                    <div class="lp-btn-parent">
                        {#if (x >= 0 && x < 9) && (y >= 0 && y < 9)}
                        <Keypad class="lp-normal-btn" style="clip-path: {getCornerRadius(x, y)};" deviceID={id} id={[x, y]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .lp-border {
        background: rgb(20, 20, 20);
        border: 2px solid rgb(120, 120, 120);
        border-radius: 3%;

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
        padding: 3%;

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

            :global(.lp-normal-btn) {
                padding: 0;
                border: none;

                height: 92%;
                width: 92%;
                border-radius: 10%;
                background-color: rgb(80, 80, 80);
            }

        }
    }

</style>
