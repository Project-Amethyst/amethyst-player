<!-- Index file for the player route -->
<script lang="ts">
    import type {KeyID} from "src/types/devices";
    import type {Color} from "../types/color"

    import {virtualDeviceComponents} from "../components/devices/Devices";

    import type {Canvas, KeyPress, KeyRelease} from "../engine/CanvasAPI"
    import type {DeviceInfoCanvas, ProjectRT} from "../engine/ProjectRT"

    import {projectEngines} from "../engine/Engines"
    import {GridController} from "../hardware/hardware";


    import Popup from "../components/Popup.svelte";
    import Dropdown from "../components/Dropdown.svelte";
    import Sidebar from "../components/Sidebar.svelte";

    import {browser} from '$app/env'

    import {afterUpdate, onMount} from "svelte";
    import "../shared.css";

    let settings = {
        virtualDevice: Object.keys(virtualDeviceComponents)[0],
        projectEngine: "Unipack" //Object.keys(projectEngines)[0],
    };

    let virtualDeviceComponent: typeof virtualDeviceComponents[number]["component"];
    $: virtualDeviceComponent = virtualDeviceComponents[settings.virtualDevice].component;

    let engine: ProjectRT;
    $: if (browser) engine = projectEngines[settings.projectEngine](api);
    let project_status:string = "not loaded";

    let virtualDevices: any[] = []; //Should be fine
    let virtualDevicesInfo: DeviceInfoCanvas[] = [];

    let popup: { [key: string]: boolean } = {};

    let projectBookmarked: boolean = false

    const updateDevicesInfo = () =>
    {
        virtualDevicesInfo = []
        virtualDevices.forEach(device => {
        virtualDevicesInfo.push(
            {
                id: device.id,
                pos: device.pos,
                info: device.deviceInfo
            }
        )
        });
    }

    const virtualKeyPressed: KeyPress = (deviceID: number, keyID: KeyID) => {
        console.info(`Virtual Button ${keyID} has been pressed`);
        // device.setColor(keyID, new Color(ColorType.RGB, [255, 255, 255]));
        // console.log(deviceInfo)
        engine?.KeyPress(virtualDevicesInfo[deviceID], keyID);
    };

    const virtualKeyReleased: KeyRelease = (deviceID: number, keyID: KeyID) => {
        console.info(`Virtual Button ${keyID} has been released`);
        // // device.setColor(keyID, new Color(ColorType.RGB, [0, 0, 0]));

        engine?.KeyRelease(virtualDevicesInfo[deviceID], keyID);
    };

    let midiDevices: GridController[] = [];
    let midiDeviceInfo: DeviceInfoCanvas = [];

    const deviceKeyPressed: KeyPress = (deviceID: number, keyID: KeyID) => {
        console.info(`Device ${deviceID} Button ${keyID} has been pressed`);
        // device.setColor(keyID, new Color(ColorType.RGB, [255, 255, 255]));
        // console.log(deviceInfo)
        engine?.KeyPress(midiDeviceInfo[deviceID], keyID);
    };

    const deviceKeyReleased: KeyRelease = (deviceID: number, keyID: KeyID) => {
        console.info(`Device ${deviceID} Button ${keyID} has been released`);
        // // device.setColor(keyID, new Color(ColorType.RGB, [0, 0, 0]));

        engine?.KeyRelease(midiDeviceInfo[deviceID], keyID);
    };

    const deviceEvent = (deviceID: number, event: any) =>
    {
        console.log(`Midi Device Event from ${deviceID}`);
        console.log(event.event);
        switch(event.event)
        {
            case "connected":
            midiDeviceInfo[deviceID] = {
                id: deviceID,
                pos: [0, 0],
                info: midiDevices[deviceID].getDeviceInfo(),
            }
            break;
            case "disconnected":
            midiDeviceInfo[deviceID] = undefined;
            break;
        }
    }
    
    midiDevices[0] = new GridController(0, deviceKeyPressed, deviceKeyReleased);

    const loadProject = () => {
        console.log("Load File Selector");
        var input = document.createElement("input");
        input.type = "file";
        input.onchange = (e) => {
            var file = e?.target?.files[0];
            engine.LoadProjectFile(file).then
            (
                result => {
                    console.log("Project Loaded")
                    project_status = "loaded";
                },
                error => {
                    alert(`Project failed to load: ${error}`)
                    project_status = "not loaded";
                },
            )
            project_status = "loading";
        };
        input.click();
    };

    var api: Canvas =
        {
            setColor: function (deviceID: number, keyID: KeyID, color: Color) {
                virtualDevices[deviceID].setColor(keyID, color);
                midiDevices[deviceID]?.setColor(keyID, color);
            },

            clear: function (deviceID: number) {
                virtualDevices[deviceID].clear(); //TODO: Implentment this
                midiDevices[deviceID].clear(); //TODO: Implentment this
            },

            getDevices: function(){
                return virtualDevicesInfo;
            }
        }

    onMount(() => {
        GridController.start(deviceEvent);
    });

    afterUpdate(() => {
        updateDevicesInfo();
    });
</script>

<main>
    <div class="main-content">
        <Sidebar 
            on:settings={() => popup["setting"] = true} 
            on:devices={() => popup["devices"] = true} 
            on:loadProject={() => {loadProject()}} 
            bind:project={engine} 
            bind:status={project_status} 
            />

        <div class="content-part">
            <div class="amethyst-player-content">
                <div class="amethyst-player-launchpad-holder center-class">
                    <div
                            style="height: 50vh; width: 50vh; padding: 20px;"
                            class="center-class"
                    >
                        <svelte:component
                                this={virtualDeviceComponent}
                                bind:this={virtualDevices[0]}
                                id={0}
                                pos={[0, 0]}
                                keyPress={virtualKeyPressed}
                                keyRelease={virtualKeyReleased}
                        />
                    </div>
                </div>
            </div>

            <div class="amethyst-player-footer center-class">
                <span>Amethyst Player (Alpha)</span>
                <!-- <span>Maintained by <a href="https://github.com/anthonyhfm" target="_blank">anthonyhfm</a>, <a href="https://github.com/203Null" target="_blank">203null</a>, <a href="https://github.com/Vexcited" target="_blank">vexcited</a> and <a href="https://github.com/mtgsquad" target="_blank">molai</a></span> -->
            </div>
        </div>
    </div>

    <Popup bind:show={popup["setting"]}>
        <div class="settings-popup">
            <div class="popup-header center-class">
                <span>Settings</span>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Virtual Device:</span>
                </div>

                <div class="setting-option">
                    <Dropdown
                            bind:value={settings.virtualDevice}
                            options={Object.keys(virtualDeviceComponents)}
                    />
                </div>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Project Engine:</span>
                </div>

                <div class="setting-option">
                    <Dropdown
                            bind:value={settings.projectEngine}
                            options={Object.keys(projectEngines)}
                    />
                </div>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Language</span>
                </div>

                <div class="setting-option">
                    <Dropdown options={["🇺🇸 English"]}/>
                </div>
            </div>
        </div>
    </Popup>

    <Popup bind:show={popup["devices"]}>
        <div class="settings-popup">
            <div class="popup-header center-class">
                <span>Devices</span>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Midi Device:</span>
                </div>

                <div class="setting-option">
                    <Dropdown value={midiDevices[0]?.activeInput?.name} options={Object.keys(GridController.availableDevices(true))} placeholder={"No Device"} on:change={(value) => 
                    {
                        if(value.detail)
                        {
                            midiDevices[0].connectDevice(GridController.availableDevices()[value.detail])
                        }
                        else
                        {
                            midiDevices[0].disconnect();
                        }
                    }}
                    />
                </div>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Midi Device Config:</span>
                </div>

                <div class="setting-option">
                    <Dropdown value={midiDevices[0]?.activeConfig?.name} options={Object.keys(GridController.configList())} placeholder={"No Config"}
                    />
                </div>
            </div>
        </div>
    </Popup>
</main>

<style lang="scss">
    main {
        background-color: #1d1d1d;
        height: 100vh;
        width: 100vw;
    }

    .center-class {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .main-content {
        display: flex;
        flex-direction: row;

        .content-part {
            width: 100%;
        }
    }

    .amethyst-player-content {
        height: calc(100vh - 100px);
        width: 100%;

        overflow: auto;

        .amethyst-player-launchpad-holder {
            height: calc(100%);
        }
    }

    .amethyst-player-footer {
        height: 100px;
        width: 100%;
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
        gap: 10px;

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

            .setting-option {
                min-width: 250px;
                display: flex;
                flex-direction: row-reverse;
            }
        }
    }
</style>
