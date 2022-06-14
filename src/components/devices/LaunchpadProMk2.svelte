<script lang="ts">
    let keyPads = []

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
        }
    }

    export function rgb_led(pitch: number, r: number, g: number, b: number) {

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
                              class="lp-round-setup-btn"
                              bind:this={keyPads[0]}
                            >

                            </button>
                        {/if}

                        {#if (x > 0 && x < 9) && (y > 0 && y < 9)}
                          <button
                            class="lp-normal-btn"
                            bind:this={keyPads[x + y * 10]}
                            style="clip-path: {getCornerRadius(x, y)}"
                          >

                          </button>
                        {:else if (x > 0 && x < 9) || (y > 0 && y < 9)}
                          <button
                            class="lp-round-corner-btn"
                            bind:this={keyPads[x + y * 10]}
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
        border-radius: 32px;

        width: fit-content;

        padding: 20px;
    }

    .lp-controls {
        height: 100%;
        width: 100%;

        display: flex;
        gap: 6px;
        flex-direction: column-reverse;

        .lp-controls-row {
            display: flex;
            gap: 6px;
        }

        .lp-btn-parent {
            height: 35px;
            width: 35px;

            display: flex;
            justify-content: center;
            align-items: center;


            .lp-round-corner-btn {
                padding: 0;
                border: none;

                height: 30px;
                width: 30px;
                border-radius: 50%;
                background-color: rgb(80, 80, 80);

                &::after {
                    content: '';
                    display: block;
                    width: 24px;
                    height: 24px;
                    background-color: rgb(10, 10, 10);
                    border-radius: 50%;
                    margin-left: 3px;
                }
            }

            .lp-normal-btn {
                padding: 0;
                border: none;

                height: 32px;
                width: 32px;
                border-radius: 10%;
                background-color: rgb(80, 80, 80);
            }

            .lp-round-setup-btn {
                padding: 0;
                border: none;

                height: 15px;
                width: 15px;
                border-radius: 50%;
                background-color: rgb(40, 40, 40);
            }

        }
    }

    .lp-mode-light {
        width: 10px;
        height: 10px;
        border-radius: 30% 30% 0 0;
        background-color: rgb(80, 80, 80);

        position: fixed;
        margin-top: 10px;
        margin-left: 197px;
    }
</style>
