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

<title>Amethyst Player</title>
<main>
    <div class="amethyst-player-sidebar expand-class">
        <div class="left-margin-30 center-class">
            <img class="logo" src="logo-256.png" alt="Amethyst Logo" width="75" height="75">

            <span class="amethyst">Amethyst</span>
        </div>

        <div class="amethyst-player-info center-class">
            <img height="40" alt="creator pfp" src="https://yt3.ggpht.com/f4s7T6OpDAjpOLZTPXfkKCIxiIbq5qWsBtNxmfq4x3WI6TMkDnYnMSPVhRNbNowS8gGI3M5ymzU=s88-c-k-c0x00ffffff-no-rj">
    
            <span class="creator-name">Clementshow</span>
    
            <span class="song-info">
                <span class="song-artist">Alan Walker</span>
                -
                <span class="song-title">The Spectre</span>
            </span>
        </div>

        <div class="settings-icon center-class">
            <button on:click={() => showSettings = true}>
                <SettingsIcon size={38}/>
            </button>

            <span on:click={() => showSettings = true} class="settings-text">Settings</span>
        </div>
    </div>

    <div class="amethyst-player-content">
        <div class="amethyst-player-launchpad-holder center-class">
            <div style="transform: scale(1.4)">
                <svelte:component this={virtualDeviceComponent} bind:this={launchpad} keyPress={(p) => virtualKeyPressed(p)}/>
            </div>
        </div>
    </div>

    <div class="amethyst-player-footer center-class">
        <span>Amethyst Player v1 - Maintained by <a href="https://github.com/anthonyhfm">anthonyhfm</a>, <a href="https://github.com/203Null">203null</a>, <a href="https://github.com/Vexcited">vexcited</a> and <a href="https://github.com/mtgsquad">molai</a></span>
        <span>Amethyst is currently in development.</span>
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

    .expand-class {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .center-class {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .amethyst-player-info {
        height: 100px;

        img {
            border-radius: 50%;
            border: 2px solid #474747;
            position: fixed;
            top: 27%;
            left: 1.75%;
            display: none;
        }

        span.creator-name {
            color: #f1f1f1;
            display: none;
            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            font-size: 14px;
            margin-left: 15px;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #2c2c2c;
            letter-spacing: 0.1rem;
            position: fixed;
            top: 27.75%;
            left: 5%;
            transform: 600ms ease;
        }

        span.song-info {
            color: #f1f1f1;
            display: none;
            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            font-size: 14px;
            margin-left: 10px;
            padding: 2.5px 5px;
            border-radius: 6px;
            background-color: #2c2c2c;
            letter-spacing: 0.1rem;
            position: fixed;
            top: 35%;
            max-width: 300px;

            span.song-title {
                color: aqua;
                font-size: 14px;
            }

            span.song-artist {
                font-size: 14px;
            }
        }
    }


    .amethyst-player-sidebar {

        span {
            color: #f1f1f1;

            font-family: 'Roboto Mono', sans-serif;
            font-weight: 700;
            font-size: 22px;
            letter-spacing: 0.1rem;
        }


        width: 110px;
        position: fixed;
        top: 0;
        bottom: 0;

        display: flex;
        flex-direction: column;

        box-shadow: 0 0 7.5px 2.5px black;

        transition: width 600ms ease;


        background-color: rgb(20, 20, 20);

        gap: 20px;

        .amethyst {
            margin: 7.5px;
            display: none;
            position: fixed;
            top: 3%;
            left: 5.5%;
            transform: 600ms ease;
            font-size: 32px;
        }

        .settings-text {
            display: none;
            position: fixed;
            top: 93%;
            left: 4.75%;
            transform: 600ms ease;
            cursor: pointer;
        }


        .logo {
            position: fixed;
            left: 1%;
            top: 2%;
        }

        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        &:hover {
            .amethyst {
                display: block;
                animation: fadeIn 1.75s;
            }

            width: 310px;

            .settings-text{
                display: block;
                animation: fadeIn 1.75s;
            }

            .creator-name {
                display: block;
                animation: fadeIn 1.75s;
            }

            .song-info {
                display: block;
                animation: fadeIn 1.75s;
            }

            .amethyst-player-info > img {
                display: block;
                animation: fadeIn 1.75s;
            }
        }

        .settings-icon {
            width: 100px;
            height: 100px;
            position: fixed;
            left: 0.25%;
            top: 89.25%;
            cursor: pointer;

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
                    cursor: pointer;
                }
            }
        }
    }

    .amethyst-player-content {
        height: calc(100vh - 300px);
        width: 100vw;

        overflow: auto;
        padding-top: 5%;

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

    .left-margin-30 {
        margin-left: 30px;
    }
</style>
