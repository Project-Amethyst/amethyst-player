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
        {#each Array(10) as _, y}
            <div class="lp-controls-row">
                {#each Array(10) as _2, x}
                    <div class="lp-btn-parent">

                        {#if x === 0 && y === 9}
                            <button
                                    class="lp-shift-btn"
                                    bind:this={keyPads[x + y * 10]}
                                    on:mousedown={() => keyPress(x + y * 10)}
                            >

                            </button>
                        {:else if (x === 9 && y === 9)}
                            <div
                                    class="lp-logo"
                            >
                                <div class="logo-inner" bind:this={keyPads[x + y * 10]}></div>
                            </div>
                        {:else if (x > 0 && x < 9) && (y > 0 && y < 9)}
                            <button
                                    class="lp-normal-btn"
                                    bind:this={keyPads[x + y * 10]}
                                    style="clip-path: {getCornerRadius(x, y)};"
                                    on:mousedown={() => keyPress(x + y * 10)}
                            >

                            </button>
                        {:else if (x > 0 && x < 9) || (y > 0 && y < 9)}
                            {#if y === 0}
                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <button
                                            class="lp-round-corner-btn-half"
                                            bind:this={keyPads[x + (y + 10) * 10]}
                                            on:mousedown={() => keyPress(x + (y + 10) * 10)}
                                    >

                                    </button>

                                    <button
                                            class="lp-round-corner-btn-half"
                                            bind:this={keyPads[x + y * 10]}
                                            on:mousedown={() => keyPress(x + y * 10)}
                                    >

                                    </button>
                                </div>
                            {:else}
                                <button
                                        class="lp-round-corner-btn"
                                        bind:this={keyPads[x + y * 10]}
                                        on:mousedown={() => keyPress(x + y * 10)}
                                >

                                </button>
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
        border-radius: 8px;

        width: fit-content;

        padding: 15px;
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
                border-radius: 5%;
                background-color: rgb(80, 80, 80);

                &::after {
                    content: '';
                    display: block;
                    width: 26px;
                    height: 26px;
                    background-color: rgb(10, 10, 10);
                    border-radius: 5%;
                    margin-left: 2px;
                }
            }

            .lp-round-corner-btn-half {
                padding: 0;
                border: none;

                height: 14px;
                width: 30px;
                border-radius: 5%;
                background-color: rgb(80, 80, 80);

                &::after {
                    content: '';
                    display: block;
                    width: 26px;
                    height: 10px;
                    background-color: rgb(10, 10, 10);
                    border-radius: 5%;
                    margin-left: 2px;
                }
            }

            .lp-normal-btn {
                padding: 0;
                border: none;

                height: 32px;
                width: 32px;
                border-radius: 5%;
                background-color: rgb(80, 80, 80);
            }

            .lp-logo {
                padding: 0;
                border: none;

                height: 32px;
                width: 32px;
                border-radius: 8%;
                background-color: rgb(5, 5, 5);

                display: flex;
                justify-content: center;
                align-items: center;

                .logo-inner {
                    width: 26px;
                    height: 26px;

                    background-color: rgb(80, 80, 80);
                    border-radius: 16%;

                    &:before {
                        content: " ";

                        position: fixed;

                        transform: rotateZ(-45deg);
                        margin-top: 7px;
                        margin-left: 2.5px;
                        width: 15px;
                        height: 6px;
                        background-color: black;
                    }

                    &:after {
                        content: " ";

                        position: fixed;

                        transform: rotateZ(-45deg);
                        margin-top: 13px;
                        margin-left: 8.5px;
                        width: 15px;
                        height: 6px;
                        background-color: black;

                        border-radius: 0 0 2px 0;
                    }
                }
            }

            .lp-shift-btn {
                padding: 0;
                border: none;

                height: 20px;
                width: 20px;
                border-radius: 15%;
                background-color: rgb(80, 80, 80);

                &::after {
                    content: '';
                    display: block;
                    width: 16px;
                    height: 16px;
                    background-color: rgb(10, 10, 10);
                    border-radius: 5%;
                    margin-left: 2px;
                }
            }

        }
    }
</style>