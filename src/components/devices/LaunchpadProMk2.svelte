<script lang="ts">
    import type { KeyPad, KeyPress } from "../../types/devices";

    let keyPads: KeyPad[] = [];
    export let keyPress: KeyPress;

    /** Get the clip path for the middle pads. */
    function getCornerRadius (x: number, y: number) {
        switch (x + y * 10) {
            case 44:
              return "polygon(80% 0, 100% 20%, 100% 100%, 0 100%, 0 0)";

            case 45:
                return "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 20%)";

            case 54:
                return "polygon(100% 0, 100% 80%, 80% 100%, 0 100%, 0 0)";

            case 55:
                return "polygon(100% 0, 100% 100%, 20% 100%, 0 80%, 0 0)";
            
            default:
                return "unset";
        }
    }

    export function rgb_led(pitch: number, r: number, g: number, b: number) {
        if(pitch === 0) return;

        if(keyPads[pitch]) {
            r = 80 + r * 3;
            g = 80 + g * 3;
            b = 80 + b * 3;

            if(r >= 255) r = 255;
            if(g >= 255) g = 255;
            if(b >= 255) b = 255;

            keyPads[pitch].style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    }
</script>

<div class="lp-border">
    <div class="lp-controls">
        {#each Array(10) as _, y}
            <div class="lp-controls-row">
                {#each Array(10) as _2, x}
                    <div class="lp-btn-parent">

                        {#if x === 0 && y === 9}
                            <button
                              class="lp-shift-btn"
                              bind:this={keyPads[0]}
                              on:mousedown={() => keyPress(0)}
                            >

                            </button>
                        {/if}

                        {#if (x > 0 && x < 9) && (y > 0 && y < 9)}
                          <button
                            class="lp-normal-btn"
                            bind:this={keyPads[x + y * 10]}
                            style="clip-path: {getCornerRadius(x, y)};"
                            on:mousedown={() => keyPress(x + y * 10)}
                          >

                          </button>
                        {:else if (x > 0 && x < 9) || (y > 0 && y < 9)}
                          <button
                            class="lp-round-corner-btn"
                            bind:this={keyPads[x + y * 10]}
                            on:mousedown={() => keyPress(x + y * 10)}
                          >

                          </button>
                        {/if}

                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <div class="lp-mode-light" bind:this={keyPads[99]}>

    </div>
</div>

<style lang="scss">
    .lp-border {
        background: rgb(20, 20, 20);
        border: 2px solid rgb(120, 120, 120);
        border-radius: 6%;

        position: relative;

        width: 100%;
        aspect-ratio: 1/1;

        padding: 4%;
    }

    .lp-controls {
        height: 100%;
        width: 100%;

        display: flex;
        gap: 1.5%;
        flex-direction: column-reverse;

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

            .lp-round-corner-btn {
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
                  
                  padding: 4px;
                  background-clip: content-box;
                  background-color: rgb(10, 10, 10);
                  border-radius: 50%;
                }
            }

            .lp-normal-btn {
                border: none;

                height: 92%;
                width: 92%;
                border-radius: 10%;
                background-color: rgb(80, 80, 80);
            }

            .lp-shift-btn {
                padding: 0;
                border: none;

                height: 35%;
                width: 35%;
                border-radius: 50%;
                background-color: rgb(40, 40, 40);
            }

        }
    }

    .lp-mode-light {
        width: 3%;
        height: 3%;
        border-radius: 30% 30% 0 0;
        background-color: rgb(80, 80, 80);

        position: absolute;
        bottom: 0; left: 0; right: 0;
        margin: 0 auto;
    }
</style>
