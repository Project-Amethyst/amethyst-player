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
        dimension: [10, 11],
        grid_dimension: [8, 8],
        grid_offset: [1, 1],
        layer_key: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7],
                    [7, 8], [6, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
                    [-1, 7], [-1, 6], [-1, 5], [-1, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]],
        special_led: [8, -1]
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
            if(keyID[0] == 'c') keyID = deviceInfo.layer_key[keyID[1]]
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
            if(Array.isArray(keyID) && keyID[1] == 9 && keyID[0] > 0 && keyID[0] < 9) //So both button light up
            {
                keyPads[index + 10].set_color(screen_color);  
            }
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
                        <Keypad class="lp-shift-btn" style="clip-path: {getCornerRadius(x, y)};" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                        {:else if (x === 9 && y === 0)}
                        <div class="lp-logo">
                            <Light class="logo-inner" bind:this={keyPads[getKeypadIndex([x,y])]}>
                                <div class="logo-holder">
                                    <div class="logo-split">
                                        <div class="top-part"></div>
                                    </div>

                                    <div class="logo-split">
                                        <div class="bottom-part"></div>
                                    </div>
                                </div>
                            </Light>
                        </div>
                        {:else if (x > 0 && x < 9) && (y > 0 && y < 9)}
                        <Keypad class="lp-normal-btn" style="clip-path: {getCornerRadius(x, y)};" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                        {:else if (x > 0 && x < 9) || (y > 0 && y < 9)}
                            {#if y === 9}
                                <div></div>
                                <div class="lp-side-btn-column">
                                    <Keypad class="lp-side-btn-half" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                                    <Keypad class="lp-side-btn-half" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y + 1])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                                </div>
                            {:else}
                            <Keypad class="lp-side-btn" deviceID={id} id={[x - deviceInfo.grid_offset[0], y - deviceInfo.grid_offset[0]]} bind:this={keyPads[getKeypadIndex([x,y])]} keyPress={keyPress} keyRelease={keyRelease}/> 
                            {/if}
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
        border-radius: 2%;

        position: relative;

        width: 100%;
        aspect-ratio: 1/1;
    }

    .lp-controls {
        height: 100%;
        width: 100%;

        display: flex;
        gap: 6px;
        flex-direction: column;

        padding: 4%;

        .lp-controls-row {
            height: 100%;
            display: flex;
            gap: 6px;
        }

        .lp-btn-parent {
            height: 100%;
            width: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            :global(.lp-side-btn) {
                height: 90%;
                width: 90%;
                border-radius: 5%;
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
                    border-radius: 5%;
                }
            }

            .lp-side-btn-column {
                height: 100%;
                width: 100%;

                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                gap: 12.5%;

                :global(.lp-side-btn-half) {
                    height: 100%;
                    width: 92%;
                    border-radius: 5%;
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
                        border-radius: 5%;
                    }
                }
            }

            :global(.lp-normal-btn) {
                height: 92%;
                width: 92%;
                border-radius: 5%;
                background-color: rgb(80, 80, 80);
            }

            :global(.lp-logo) {
                height: 90%;
                width: 90%;
                border-radius: 8%;
                background-color: rgb(5, 5, 5);

                display: flex;
                justify-content: center;
                align-items: center;

                :global(.logo-inner) {
                    width: 85%;
                    height: 85%;

                    background-color: rgb(80, 80, 80);
                    border-radius: 5%;
                    overflow: hidden;

                    :global(.logo-holder) {
                        height: 100%;
                        width: 100%;
                        transform: rotateZ(-45deg) scale(0.9);

                        :global(.logo-split) {
                            height: 50%;
                            width: 100%;

                            display: flex;
                            justify-content: center;
                            align-items: center;

                            :global(.top-part) {
                                background-color: black;
                                margin-top: 10%;

                                height: 60%;
                                width: 70%;
                            }

                            :global(.bottom-part) {
                                background-color: black;
                                margin-bottom: 10%;

                                height: 60%;
                                width: 70%;

                                border-radius: 0 0 0.75vh 0;
                            }
                        }
                    }
                }
            }

            :global(.lp-shift-btn) {
                height: 60%;
                width: 60%;
                border-radius: 15%;
                background-color: rgb(80, 80, 80);

                &::after {
                    content: "";
                    display: block;
                    box-sizing: border-box;

                    height: 100%;
                    width: 100%;
                    
                    padding: 8%;
                    background-clip: content-box;
                    background-color: rgb(10, 10, 10);
                    border-radius: 5%;
                }
            }

        }
    }
</style>
