<script>
    import {browser} from "$app/environment";
    import { createEventDispatcher } from 'svelte';

    let sliderBody;
    let slider;

    export let value;
    export let max;
    export let min;

    let dispatch = createEventDispatcher();
</script>

<!--<div class="slider-body {$$props.class}" style={$$props.style} on:click={clickSlider} on:mousemove={mouseMove} bind:this={sliderBody}>
    <div class="slider-rail" bind:this={sliderRail}>

    </div>

    <div class="slider-thumb" bind:this={sliderThumb}></div>
</div>-->

<div class="slider-body {$$props.class}" style={$$props.style} bind:this={sliderBody}>
    <input type="range" class="slider" on:change={e => {value = e.target.value; dispatch("change", e.target.value)}} bind:this={slider} min={min} max={max} value={value}>
</div>

<style lang="scss">


    .slider-body {
        width: 100%;
        padding: 0 10px;

        height: 20px;
        display: flex;
        align-items: center;

        .slider {
            -webkit-appearance: none;  /* Override default CSS styles */
            appearance: none;

            width: 100%;
            height: 4px;
            border-radius: 10px;
            background-color: gray;

            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 10px;
                height: 18px;
                border-radius: 5px;
                background-color: white;
                cursor: pointer;
            }

            &::-moz-range-thumb {
                width: 10px;
                height: 18px;
                border-radius: 5px;
                background-color: white;
                cursor: pointer;
            }
        }

        /*.slider-rail {
            height: 4px;
            background-color: gray;
            border-radius: 2px;

            width: 100%;
        }

        .slider-thumb {
            width: 10px;
            height: 18px;
            border-radius: 5px;

            background-color: white;

            cursor: grab;

            position: absolute;
        }*/
    }
</style>

