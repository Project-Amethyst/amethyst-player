<!-- Index file for the player route -->

<script lang="ts">
    import SettingsIcon from "carbon-icons-svelte/lib/Settings.svelte"
    import LaunchpadProMk2 from "../../components/devices/LaunchpadProMk2.svelte";
    import LaunchpadMk2 from "../../components/devices/LaunchpadMk2.svelte";
    import LaunchpadX from "../../components/devices/LaunchpadX.svelte";
    import LaunchpadProMk3 from "../../components/devices/LaunchpadProMk3.svelte";
    import Matrix from "../../components/devices/Matrix.svelte";
    import Popup from "../../components/Popup.svelte";
    import Dropdown from "../../components/Dropdown.svelte";
    import {onMount} from "svelte";
    import '../../shared.css';

    let virtualDeviceComponents = [
        { component: LaunchpadProMk2 },
        { component: LaunchpadMk2 },
        { component: LaunchpadX },
        { component: LaunchpadProMk3 },
        { component: Matrix },
    ]

    let settings = {
        virtualDeviceIndex: 0
    }

    let virtualDeviceComponent;
    $: virtualDeviceComponent = virtualDeviceComponents[settings.virtualDeviceIndex].component;

    let launchpad;

    let showSettings;

    function virtualKeyPressed(pitch: number) {
        console.log("Virtual Launchpad Button " + pitch + " has been pressed")
    }

    onMount(() => {
        launchpad.rgb_led(44, 63, 0, 0) // It takes rgb byte values from 0-63
    })
</script>

<main>
    <div class="amethyst-player-header center-class" style="justify-content: flex-start">
        <div class="center-class" style="gap: 20px; margin-left: 30px;">
            <img src="logo-256.png" width="75" height="75">

            <span>Amethyst Player</span>
        </div>
    </div>

    <div class="amethyst-player-info center-class">
        <img height="40" src="https://yt3.ggpht.com/f4s7T6OpDAjpOLZTPXfkKCIxiIbq5qWsBtNxmfq4x3WI6TMkDnYnMSPVhRNbNowS8gGI3M5ymzU=s88-c-k-c0x00ffffff-no-rj">

        <span class="creator-name">Clementshow</span>

        <span class="song-info">
            <span class="song-artist">Alan Walker</span>
            -
            <span class="song-title">The Spectre</span>
        </span>
    </div>

    <div class="amethyst-player-content">
        <div class="amethyst-player-launchpad-holder center-class">
            <div style="transform: scale(1.4)">
                <svelte:component this={virtualDeviceComponent} bind:this={launchpad} keyPress={(p) => virtualKeyPressed(p)}/>
            </div>
        </div>
    </div>

    <div class="amethyst-player-footer center-class">
        <span>Amethyst Player (Web)</span>
        <span>Maintained by <a href="">anthonyhfm</a>, <a href="">203null</a>, <a href="">vexcited</a> and <a href="">molai</a></span>
    </div>

    <Popup bind:show={showSettings}>
        <div class="settings-popup">
            <div class="popup-header center-class">
                <span>Settings</span>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Virtual Device:</span>
                </div>

                <div>
                    <Dropdown options={
                        [
                            "Launchpad Pro Mk2",
                            "Launchpad Mk2",
                            "Launchpad X",
                            "Launchpad Pro Mk3",
                            "Matrix"
                        ]
                    } bind:value={settings.virtualDeviceIndex} />

                </div>
            </div>
        </div>
    </Popup>
</main>

<style lang="scss">
    main {
        background-color: #1D1D1D;
        height: 100vh;
        width: 100vw;
    }

    .center-class {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .amethyst-player-header {
        height: 100px;

        background-color: rgb(20, 20, 20);

        gap: 20px;

        span {
            color: #f1f1f1;

            font-family: 'Roboto Mono', sans-serif;
            font-weight: 700;
            font-size: 32px;
            letter-spacing: 0.1rem;
        }

        .settings-icon {
            width: 100px;
            height: 100px;
            position: fixed;
            left: calc(100vw - 100px);

            button {
                height: 38px;
                width: 38px;
                padding: 0;
                background: transparent;
                border: none;
                color: whitesmoke;
                transition: transform 0.2s ease-in-out;

                &:hover {
                    transform: rotateZ(45deg);
                    color: #c5c5c5;
                }
            }
        }
    }

    .amethyst-player-info {
        height: 100px;

        img {
            border-radius: 50%;
            border: 2px solid #474747;
        }

        span.creator-name {
            color: #f1f1f1;

            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            font-size: 18px;
            margin-left: 15px;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #2c2c2c;
            letter-spacing: 0.1rem;
        }

        span.song-info {
            color: #f1f1f1;

            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            font-size: 18px;
            margin-left: 20px;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #2c2c2c;
            letter-spacing: 0.1rem;

            span.song-title {
                color: aqua;
            }
        }
    }

    .amethyst-player-content {
        height: calc(100vh - 300px);
        width: 100vw;

        overflow: auto;

        .amethyst-player-launchpad-holder {
            height: calc(100%);
        }

    }

    .amethyst-player-footer {
        height: 100px;
        width: 100vw;
        flex-direction: column;
        gap: 10px;

        span {
            font-size: 18px;

            font-family: "Roboto Mono", sans-serif;
            color: #969696;
            font-weight: 300;

            a {
                color: aqua;

                &:hover {
                    color: #0ec0c0;
                }
            }
        }
    }

    .settings-popup {
        display: flex;
        flex-direction: column;

        .popup-header {
            height: 30px;
            font-size: 26px;

            font-family: "Roboto Mono", sans-serif;
            color: whitesmoke;
            font-weight: 300;

            margin-bottom: 20px;
        }

        .setting {
            height: 35px;

            display: flex;
            align-items: center;

            .setting-name {
                width: 250px;
                display: flex;
                align-items: center;

                color: whitesmoke;

                font-family: "Roboto Mono", sans-serif;
                font-weight: 400;
            }
        }
    }
</style>
