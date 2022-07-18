<script lang="ts">
    import type {KeyID, KeyPress, KeyRelease } from "../../types/devices";
    import Keypad from "./keypad.svelte";

    let keyPads: any[] = [];
    export let keyPress: KeyPress;
    export let keyRelease: KeyRelease;

    var dimension = [8, 8];
    var grid_dimension = [8, 8];
    var grid_offset = [0, 0];

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

    
    function get_index(keyID: KeyID): number {
        if(Array.isArray(keyID))
        {
            return keyID[1] * 10 + keyID[0];
        }
        else
        {
            return keyID;
        }
    }

    export function rgb_led(keyID: KeyID, r: number, g: number, b: number) {
        if(Array.isArray(keyID))
        {
            keyID = [
                keyID[0] + grid_offset[0],
                keyID[1] + grid_offset[1]
            ];
        }
        let index = get_index(keyID)
        if(keyPads[index]) {
            r = 80 + r * 3;
            g = 80 + g * 3;
            b = 80 + b * 3;

            if(r >= 255) r = 255;
            if(g >= 255) g = 255;
            if(b >= 255) b = 255;

            keyPads[index].set_color(r, g, b);           
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
                        <Keypad class="lp-normal-btn" style="clip-path: {getCornerRadius(x, y)};" id={[x - grid_offset[0], y - grid_offset[0]]} bind:this={keyPads[get_index([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
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
        border-radius: 4%;

        position: relative;

        width: 100%;
        aspect-ratio: 1/1;

        padding: 3%;
    }

    .lp-controls {
        height: 100%;
        width: 100%;

        display: flex;
        gap: 1.5%;
        flex-direction: column;

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
