<script lang="ts">
    let keyPads = []

    export let keyPress;

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
        {#each Array(9) as _, y}
            <div class="lp-controls-row">
                {#each Array(9) as _2, x}
                    {#if x + 1 > 0 && y + 1 > 0}
                        <div class="lp-btn-parent">

                            {#if (x + 1 > 0 && x + 1 < 9) && (y + 1 > 0 && y + 1 < 9)}
                                <button
                                        class="lp-normal-btn"
                                        bind:this={keyPads[(x + 1) + (y + 1) * 10]}
                                        style="clip-path: {getCornerRadius(x + 1, y + 1)};"
                                        on:mousedown={() => keyPress((x + 1)  + (y + 1) * 10)}
                                >

                                </button>
                            {:else if (x + 1 > 0 && x + 1 < 9) || (y + 1 > 0 && y + 1 < 9)}
                                <button
                                        class="lp-round-corner-btn"
                                        bind:this={keyPads[(x + 1) + (y + 1) * 10]}
                                        on:mousedown={() => keyPress((x + 1)  + (y + 1) * 10)}
                                >

                                </button>
                            {/if}

                        </div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .lp-border {
        background: rgb(20, 20, 20);
        border: 2px solid rgb(120, 120, 120);
        border-radius: 16px;

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

        }
    }
</style>
