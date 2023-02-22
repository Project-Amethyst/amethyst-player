<script lang="ts">
    import {ChevronLeft, ChevronRight} from "carbon-icons-svelte";
    import { onMount, onDestroy } from "svelte";

    export let project:ProjectRT;
    
    let currentLayer: number = 0;
    let layerCount: number = 0;


    function selectLayer(index: number) {
        project.LayerChange(index)
    }

    function selectOffsetLayer(offset: -1 | 1): void {
        var newLayer = currentLayer;
        if(offset == -1) {
            if (newLayer - 1 >= 0) {
                newLayer -= 1
            }
        }
        else {
            if (newLayer + 1 < layerCount) {
                newLayer += 1
            }
        }

        project.LayerChange(newLayer)
    }

    var refreshInterval = setInterval(() => {
            currentLayer = project.currentLayer;
        }, 10)

    onMount(() => {
        layerCount = project.projectInfo.layer;
        currentLayer = project.currentLayer;
    })
    
    onDestroy(() => {
        clearInterval(refreshInterval)
    })
</script>

<div class="layer-selector-container">
    <div class="layer-control" on:click={() => selectOffsetLayer(-1)}>
        <ChevronLeft size={24}/>
    </div>

    <div class="layers-container">
        {#each Array(layerCount) as _, layer}
            <div class="layer" on:click={() => currentLayer === selectLayer(layer)} class:selected={currentLayer === layer}>
                    <span>{layer + 1}</span>
            </div>
        {/each}
    </div>

    <div class="layer-control" on:click={() => selectOffsetLayer(1)}>
        <ChevronRight size={24} />
    </div>
</div>

<style lang="scss">
    .layer-selector-container {
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        // filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25));

        .layer-control {
            width: 36px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            cursor: pointer;
            flex-shrink: 0;

            transition: background-color 0.2s ease;
            background-color: #242424;

            color: #d5d5d5;

            &:hover {
                background-color: rgb(10, 10, 10);

                color: #c5c5c5;
            }

            &:active  {
                background-color: #lightgray;
                scale: 0.95;
            }
        }

        .layers-container {
            min-width: fit-content;
            max-width: calc(80px * 6 + 0.5em * 5);
            display: flex;
            justify-content: center;
            grid-template-columns: repeat(auto-fit, 80px);
            gap: 0.5em;

            overflow: hidden;

            .layer {
                width: 40px;
                height: 40px;

                background-color: #242424;
                cursor: pointer;

                display: flex;
                justify-content: center;
                align-items: center;

                flex-shrink: 0;
                
                transition: background-color 0.2s ease, width 0.2s ease;

                span {
                    color: #B5B5B5;
                    font-family: Inter, sans-serif;
                    font-weight: 500;
                }

                &:hover {
                    background-color: #141414;
                    width: 50px;
                }

                &.selected {
                    background-color: #141414;
                    width: 80px;
                    span {
                        color: #c5c5c5;
                        font-family: Inter, sans-serif;
                        font-weight: 500;
                    }
                }   
            }
        }
    }
</style>