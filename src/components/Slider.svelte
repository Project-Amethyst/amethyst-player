<script>
    import {browser} from "$app/env";

    let sliderBody;
    let sliderThumb;
    let sliderRail;

    export let value = 0;
    export let max = 100;
    export let min = 0;

    function setSliderValue() {
        var range = 0;

        if(min < 0) range += min * -1
        else range += min

        if(max < 0) range += max * -1
        else range += max

        if(window.event.clientX >= sliderRail.getBoundingClientRect().x && window.event.clientX <= sliderRail.getBoundingClientRect().x + sliderRail.clientWidth) {
            sliderThumb.style.left = window.event.clientX - 5 + "px";


        }
    }

    function clickSlider() {


        setSliderValue()
    }

    function mouseMove(event) {
        if(event.buttons === 1) {
            setSliderValue()
        }
    }
</script>

<div class="slider-body {$$props.class}" style={$$props.style} on:click={clickSlider} on:mousemove={mouseMove} bind:this={sliderBody}>
    <div class="slider-rail" bind:this={sliderRail}>

    </div>

    <div class="slider-thumb" bind:this={sliderThumb}></div>
</div>

<style lang="scss">
    .slider-body {
        width: 100%;
        padding: 0 10px;

        height: 20px;
        display: flex;
        align-items: center;

        .slider-rail {
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
        }
    }
</style>

