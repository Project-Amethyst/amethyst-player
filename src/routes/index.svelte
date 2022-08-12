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

    import { SvelteToast, toast } from '@zerodevx/svelte-toast'

    import {browser} from '$app/env'

    import {afterUpdate, onMount} from "svelte";
    import "../shared.css";

    let settings = {
        virtualDevice: Object.keys(virtualDeviceComponents)[0],
        virtualDeviceScale: "100%",
        projectEngine: "Unipack", //Object.keys(projectEngines)[0],
        deviceInput: undefined,
        deviceOutput: undefined,
        deviceConfig: undefined,
        deviceSettingAdvanced: false,
    };
    var settings_loaded = false;

    $: if(browser && settings_loaded){console.log("Saving setting"); console.log(settings); localStorage.setItem("settings", JSON.stringify(settings))};

    let virtualDeviceComponent: typeof virtualDeviceComponents[number]["component"];
    $: virtualDeviceComponent = virtualDeviceComponents[settings.virtualDevice].component;

    let engine: ProjectRT;
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
        console.info(`Virtual Device ${keyID} has been pressed`);
        // device.setColor(keyID, new Color(ColorType.RGB, [255, 255, 255]));
        // console.log(deviceInfo)
        engine?.KeyPress(virtualDevicesInfo[deviceID], keyID);
    };

    const virtualKeyReleased: KeyRelease = (deviceID: number, keyID: KeyID) => {
        console.info(`Virtual Device ${keyID} has been released`);
        // // device.setColor(keyID, new Color(ColorType.RGB, [0, 0, 0]));

        engine?.KeyRelease(virtualDevicesInfo[deviceID], keyID);
    };

    let midiDevices: GridController[] = [];
    let midiDeviceInfos: DeviceInfoCanvas = [];

    const deviceKeyPressed: KeyPress = (deviceID: number, keyID: KeyID) => {
        console.info(`Device ${deviceID} Button ${keyID} has been pressed`);
        // device.setColor(keyID, new Color(ColorType.RGB, [255, 255, 255]));
        // console.log(deviceInfo)
        engine?.KeyPress(midiDeviceInfos[deviceID], keyID);
    };

    const deviceKeyReleased: KeyRelease = (deviceID: number, keyID: KeyID) => {
        console.info(`Device ${deviceID} Button ${keyID} has been released`);
        // // device.setColor(keyID, new Color(ColorType.RGB, [0, 0, 0]));

        engine?.KeyRelease(midiDeviceInfos[deviceID], keyID);
    };

    const deviceEvent = (event: {}) =>
    {
        console.log(`Midi Device Event`);
        console.log(event);
        switch(event.event)
        {
            case "opened":
            midiDeviceInfos[event.deviceID] = {
                name: midiDevices[event.deviceID].name,
                id: event.deviceID,
                pos: [0, 0],
                info: midiDevices[event.deviceID].getDeviceInfo(),
            }
            reactiveVars.activeDevice = midiDevices[event.deviceID].name;
            reactiveVars.activeInput = midiDevices[event.deviceID].activeInput.name;
            reactiveVars.activeOutput = midiDevices[event.deviceID].activeOutput.name;
            reactiveVars.activeConfig = midiDevices[event.deviceID].activeConfig.name;
            toast.push(`${midiDeviceInfos[event.deviceID].name} is now the active device`, {
                theme: {
                    '--toastColor': '#FFFFFF;',
                    '--toastBackground': '#48BB78',
                    '--toastBarBackground': '#2F855A'
                }
            });
            break;
            case "closed":
            if(midiDeviceInfos[event.deviceID] != undefined) //So when user action caused port close (it will set deviceInfo to undefined). No toast will be shown
            {
                toast.push(`${midiDeviceInfos[event.deviceID].name} is not longer the active device`, {
                    theme: {
                        '--toastColor': '#FFFFFF;',
                        '--toastBackground': '#F56565',
                        '--toastBarBackground': '#C53030'
                    }
                });
            }
            midiDeviceInfos[event.deviceID] = undefined;
            reactiveVars.activeDevice = undefined;
            reactiveVars.activeInput = undefined;
            reactiveVars.activeOutput = undefined;
            reactiveVars.activeConfig = undefined;
            break;

            case "connected":
            if(event.device == settings.deviceInput){
                toast.push(`${event.device} connected`);
                midiDevices[0].connect(GridController.availableDeviceInputs()[event.device], GridController.availableDeviceOutputs()[event.device], settings.deviceConfig);
            }
            else
            {
                toast.push(`${event.device} detected`);
                // toast.push(`${event.device} connected\nClick to set it as the active device`);
            }
            break;

            case "disconnected":
            toast.push(`${event.device} disconnected`);
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

    let reactiveVars = {
        activeDevice: undefined,
        activeInput: undefined,
        activeOutput: undefined,
        activeConfig: undefined,
    }
    onMount(async () => {
        await GridController.start(deviceEvent);
        if(browser && localStorage.getItem("settings") != null) 
        {
            settings = JSON.parse(localStorage.getItem("settings"));
            midiDevices[0].connect(
                GridController.availableDeviceInputs()[settings.deviceInput], 
                GridController.availableDeviceOutputs()[settings.deviceOutput], 
                GridController.configList()[settings.deviceConfig]);
                        
            console.log(settings);
            
        }
        settings_loaded = true;
        setInterval(() => {
            if(reactiveVars.activeConfig != midiDevices[0]?.activeConfig?.name)
                reactiveVars.activeConfig = midiDevices[0]?.activeConfig?.name;
        }, 1000/30)
        engine = projectEngines[settings.projectEngine](api);
    });

    afterUpdate(() => {
        updateDevicesInfo();
    });

</script>

<main>
    <div class="main-content">
        <div class="toast">
            <SvelteToast/>
        </div>
        <Sidebar 
            on:settings={() => popup["setting"] = true} 
            on:devices={() => popup["devices"] = true} 
            on:demoplay={() => popup["demoplay"] = true} 
            on:loadProject={() => {loadProject()}} 
            bind:project={engine} 
            bind:status={project_status} 
            />

        <div class="content-part">
            <div class="amethyst-player-content">
                <div class="amethyst-player-launchpad-holder center-class">
                    <div
                            style={`height: 50vh; width: 50vh; padding: 20px; scale:${settings.virtualDeviceScale};`}
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
                    <span>Virtual Device Scale:</span>
                </div>

                <div class="setting-option">
                    <Dropdown
                            bind:value={settings.virtualDeviceScale}
                            options={["50%", "75%", "100%", "125%", "150%"]}
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
                            on:change={() => {engine = projectEngines[settings.projectEngine](api);}}
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
            
            {#if !settings.deviceSettingAdvanced}
            <div class="setting">
                <div class="setting-name">
                    <span>Midi Device:</span>
                </div>

                <div class="setting-option">
                    <Dropdown value={reactiveVars.activeDevice} options={Object.keys(GridController.availableDevices())} placeholder={"No Device"} on:change={(value) => 
                    {
                        settings.deviceInput = value.detail;
                        settings.deviceOutput = value.detail;
                        if(value.detail)
                        {
                            midiDeviceInfos[0] = undefined;
                            midiDevices[0].connectDevice(GridController.availableDevices()[value.detail]);
                        }
                        else
                        {
                            midiDevices[0].disconnect();
                        }
                    }}
                    />
                </div>
            </div>

            {:else}
            <div class="setting">
                <div class="setting-name">
                    <span>Midi Input Device:</span>
                </div>

                <div class="setting-option">
                    <Dropdown value={reactiveVars.activeInput} options={Object.keys(GridController.availableDeviceInputs())} placeholder={"No Device"} on:change={(value) => 
                    {
                        settings.deviceInput = value.detail;
                        if(value.detail)
                        {
                            midiDeviceInfos[0] = undefined;
                            midiDevices[0].connect(GridController.availableDeviceInputs()[value.detail], midiDevices[0].activeOutput, midiDevices[0].activeConfig);
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
                    <span>Midi Output Device:</span>
                </div>

                <div class="setting-option">
                    <Dropdown value={reactiveVars.activeOutput} options={Object.keys(GridController.availableDeviceOutputs())} placeholder={"No Device"} on:change={(value) => 
                    {
                        settings.deviceOutput = value.detail;
                        if(value.detail)
                        {
                            midiDeviceInfos[0] = undefined;
                            midiDevices[0].connect(midiDevices[0].activeInput, GridController.availableDeviceOutputs()[value.detail], midiDevices[0].activeConfig);
                        }
                        else
                        {
                            midiDevices[0].disconnect();
                        }
                    }}
                    />
                </div>
            </div>
            {/if}

            <div class="setting">
                <div class="setting-name">
                    <span>Midi Device Config:</span>
                </div>

                <div class="setting-option">
                    <Dropdown value={reactiveVars.activeConfig} options={Object.keys(GridController.configList())} placeholder={"No Config"} on:change={(value) =>
                    {
                        settings.deviceConfig = value.detail;
                        if(value.detail)
                        {
                            midiDeviceInfos[0] = undefined;
                            midiDevices[0].connect(midiDevices[0].activeInput, midiDevices[0].activeOutput, GridController.configList()[value.detail]);
                        }
                        else
                        {
                            midiDevices[0].disconnect();
                        }
                    }
                    }
                    />
                </div>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Advanced Mode</span>
                </div>

                <div class="setting-option">
                    <input type="checkbox" bind:checked={settings.deviceSettingAdvanced}>
                </div>
            </div>
        </div>
    </Popup>

    <Popup bind:show={popup["demoplay"]}>
        <div class="settings-popup">
            <div class="popup-header center-class">
                <span>Demoplay</span>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Light Animation</span>
                </div>

                <div class="setting-option">
                    <input type="checkbox">
                </div>
            </div>

            <div class="setting">
                <div class="setting-name">
                    <span>Learning Mode</span>
                </div>

                <div class="setting-option">
                    <input type="checkbox">
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

    .toast {
        display: contents;
        font-family: "Roboto Mono", sans-serif;
        font-style: normal;
        font-size: 16px;
        font-weight: 300;
        --toastColor: #CBCBCB;
        --toastBackground: #141414;
        --toastBarBackground: #3E3E3E;
    }
</style>
