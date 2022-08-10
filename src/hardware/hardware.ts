import type { Input, Output } from "webmidi";
import { MidiDevice, type GridDeviceConfig } from "./types/devices";

import type {KeyID, DeviceInfo} from "../types/devices";
import type {KeyPress, KeyRelease} from "../engine/CanvasAPI"
import { ColorType, Color } from "../types/color"


import { WebMidi } from "webmidi";
import DeviceConfigs from "./devices";

export class GridController {
    id: number;
    activeInput?: Input;
    activeOutput?: Output;
    activeConfig?: GridDeviceConfig

    keyPress: KeyPress;
    keyRelease: KeyRelease;

    static callback?: (deviceID: number, event: object) => unknown

    constructor(id: number, keyPress: KeyPress, keyRelease: KeyRelease)
    {
        this.id = id;
        this.keyPress = keyPress;
        this.keyRelease = keyRelease;
    }

    static async start(callback: any)
    {
        if(WebMidi.enabled == false)
        {
            await WebMidi.enable()
                .catch(error => {
                console.error("An error was thrown by WebMidi", error);
                });
            
        }
        GridController.callback = callback;
    }

    /** Returns the configuration of all the devices. */
    static configList(): {[name:string]: GridDeviceConfig}
    {
        return DeviceConfigs;
    }

    static addConfig(config : GridDeviceConfig)
    {
        DeviceConfigs[config.name] = config;
    }

    static availableDevices(strict_mode:boolean = false) : {[name:string]: MidiDevice}
    {
        let devices:{[name:string]: MidiDevice} = {};

        for(const input of WebMidi.inputs)
        {
            for(const output of WebMidi.outputs)
            {
                if(input.name === output.name)
                {   
                    let config: GridDeviceConfig | undefined = undefined;
                    for (const name in DeviceConfigs) 
                    {
                        let config_regex : string = DeviceConfigs[name].midiNameRegex!;
                        if(input.name.match(config_regex) !== null)
                        {
                            console.log(`Output device config found: ${name}`)
                            config = DeviceConfigs[name];
                            break;
                        }
                    }

                    if(strict_mode && config === undefined)
                        break;

                    devices[input.name] = new MidiDevice(input.name, input, output, config);
                    break;
                }
            }
        }

        return devices;
        
    }

    /** Returns all the available MIDI inputs. */
    static availableDeviceInputs() : Input[]
    {
        return WebMidi.inputs;
    }

    /** Returns all the available MIDI ouputs. */
    static availableDeviceOutputs() : Output[]
    {
        return WebMidi.outputs;
    }

    deviceEventHandler(e : any) // TODO Fix
    {
        // console.log(e)
        switch(e.type)
        {
            case "midimessage":
            {
                switch(e.message.type)
                {
                    case "noteon":
                    case "noteoff":
                    {
                        // console.log(`${e.message.type} - ${e.message.data}`)
                        if(this.activeConfig)
                        {
                            let xy:[number, number] = this.activeConfig.noteToXY(e.message.data[1])
                            if(e.message.data[2])
                            {
                                this.keyPress(this.id, xy);
                            }
                            else
                            {
                                this.keyRelease(this.id, xy);
                            }
                        }
                        break;
                    }
            }
                break;
            }
            case "disconnected":
            {
                console.log("Device disconnected")
                this.disconnect();
                break;
            }
            default:
            {
                console.log(e.type);
            }
        }
    }

    connectDevice(device: MidiDevice)
    {
        console.log(`Connecting ${device.name}`)
        this.activeInput = device.input;
        this.activeOutput = device.output;
        this.activeConfig = device.config;

        this.activeInput?.addListener("midimessage", e => this.deviceEventHandler(e));
        this.activeInput?.addListener("disconnected", e => this.deviceEventHandler(e));

        // console.log(this.activeInput);
        // console.log(this.activeOutput);
        // console.log(this.activeConfig);

        GridController.callback(this.id, {event: "connected"});
    }

    connect(input_device:Input|undefined, output_device:Output|undefined, config?:GridDeviceConfig|string) 
    {
        this.activeInput = input_device;
        this.activeOutput = output_device;

        if(input_device === undefined && output_device === undefined)
        {
            console.log("Both Input and output are undefined");
        }
        else
        {
            this.activeInput?.addListener("midimessage", e => this.deviceEventHandler(e))
            this.activeInput?.addListener("disconnected", e => this.deviceEventHandler(e))
        }
        
        if(config === undefined) //We need to try to auto match device config
        {
            //Input
            let input_config : GridDeviceConfig|undefined = undefined;
            if(input_device)
            {
                console.log(`Attempting find input config for ${input_device.name}`);
                let input_name : string = input_device?.name;
                for (const name in DeviceConfigs) 
                {
                    let config_regex : string = DeviceConfigs[name].midiNameRegex!;
                    if(input_name.match(config_regex) !== null)
                    {
                        console.log(`Input device config found: ${name}`)
                        input_config = DeviceConfigs[name];
                        break;
                    }
                }
            }

            //Output
            let output_config : GridDeviceConfig|undefined = undefined;
            if(output_device)
            {
                console.log(`Attempting find output config for ${output_device.name}`);
                let output_name : string = output_device?.name;
                for (const name in DeviceConfigs) 
                {
                    let config_regex : string = DeviceConfigs[name].midiNameRegex!;
                    if(output_name.match(config_regex) !== null)
                    {
                        console.log(`Output device config found: ${name}`)
                        output_config = DeviceConfigs[name];
                        break;
                    }
                }
            }

            if(output_config === input_config)
            {
                this.activeConfig = output_config;
            }
            else //Not matched
            {
                if(input_device === undefined && output_config)
                {
                    this.activeConfig = output_config;
                }
                else if(output_device === undefined && input_config)
                {
                    this.activeConfig = input_config;
                }
                else
                {
                    this.activeConfig = undefined;
                    console.log("Unable to auto match device config")
                }
            }
        }
        else if(typeof config === "string")
        {  
            console.log(`DeviceConfig ${config} used`)
            this.activeConfig = DeviceConfigs[<string>config]; 
        }
        else // if (typeof config === "DeviceConfig") - Does not work, let's assume it is DeviceConfig
        {
            console.log("DeviceConfig from parameter used")
            this.activeConfig = <GridDeviceConfig>config;
        }

        if(this.activeConfig === undefined)
        {
            console.log("No active config");
        }
        else
        {
            console.log(`${this.activeConfig.name} config used`);
        }

    }

    disconnect() 
    {
        this.activeInput?.removeListener();
        this.activeOutput?.removeListener();

        this.activeInput = undefined;
        this.activeOutput = undefined;
        this.activeConfig = undefined;

        GridController.callback(this.id, {event: "disconnected"});
    }

    getDeviceInfo(): DeviceInfo | undefined
    {
        if(this.activeConfig === undefined)
            return undefined;
        
        return {
            dimension: this.activeConfig.dimension,
            grid_dimension: this.activeConfig.gridDimension,
            grid_offset: this.activeConfig.gridOffset,
            chain_key: this.activeConfig.chainKey,
        }
    }

    setConfig(config:GridDeviceConfig) {}

    outputReady()
    {
        return this.activeOutput != undefined && this.activeConfig != undefined;  
    }

    setColor(keyID: KeyID, color: Color) {
        if(this.activeConfig === undefined)
            return;
        if(Array.isArray(keyID))
        {
            keyID = [
                keyID[0] + this.activeConfig.gridOffset[0],
                keyID[1] + this.activeConfig.gridOffset[1]
            ];
        }
        let note = this.activeConfig.keymap[keyID[1]][keyID[0]];
        // console.log(`${keyID[0]} ${keyID[1]} ${note}`)
        if(note) {
            if(color.type === ColorType.Palette)
            {
                // console.log(`Send ${this.activeConfig.defaultChannel}, ${note}, ${color.value[0]}`);
                this.activeOutput!.sendNoteOn(note, {channels: this.activeConfig.defaultChannel, rawAttack: color.value[0]})
            }         
        }
    }

    setPixel(x: number, y: number, color: number) {}

    setPixelPalette(x: number, y: number, index: number, channel?: number) 
    {
        if(this.outputReady() === false)
            return false;

        let device_x = this.activeConfig!.gridOffset[0] + x;
        let device_y = this.activeConfig!.gridOffset[1] + y;
        let note = this.activeConfig!.keymap[device_y][device_x];

        if(note == undefined || isNaN(note))
            return false;

        if(channel == undefined) {channel = this.activeConfig?.defaultChannel}

        this.activeOutput!.sendNoteOn(note, {channels: channel, rawAttack: index})

        return true;
    }

    clear(){}

    fill(color: number){}

    fillPalette(index: number, channel?: number){}


}