<script lang="ts">
    import CaretDownIcon from "carbon-icons-svelte/lib/CaretDown.svelte";

    export let options: string[];
    export let value: number = 0;

    let showOptions: boolean;
    let dropdownButton: HTMLDivElement;

    function clickOutsideOptions(node: HTMLDivElement) {
        const handleClick = (event: MouseEvent) => {
            if (!event.target) return;
            const target = event.target as HTMLElement;

            // Recognizes if the dropdown button was pressed again.
            if (dropdownButton.contains(target)) return;

            // Close the dropdown if we click anywhere else.
            if (!node.contains(target)) {
                showOptions = false
            }
        };

        document.addEventListener("click", handleClick, true);

        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            }
        };
    }
</script>

<div style="display: flex; flex-direction: column;">
    <div class="dropdown-select-body" bind:this={dropdownButton} on:click={() => showOptions = !showOptions}>
        <div class="left-portion">
            <span>{options[value]}</span>
        </div>

        <div class="right-portion">
            <CaretDownIcon size={20} />
        </div>
    </div>

    {#if showOptions}
        <div class="dropdown-select-options" use:clickOutsideOptions>
            {#each options as option}
                <div class="dropdown-option" on:click={() => {
                    value = options.indexOf(option)
                    showOptions = false;
                }}>
                    {option}
                </div>
            {/each}
        </div>
    {/if}

</div>

<style lang="scss">
    .dropdown-select-body {
        display: inline-flex;
        flex-direction: row;
        cursor: pointer;

        height: 34px;
        border-radius: 8px;

        background-color: rgb(20, 20, 20);
        border: 2px solid rgb(40, 40, 40);

        .left-portion {
            display: flex;
            align-items: center;

            span {
                margin-left: 10px;
                font-family: "Roboto Mono", monospace;

                user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                -webkit-user-select: none;
            }

            width: 100%;

            color: #cbcbcb;
        }

        .right-portion {
            width: 30px;
            height: 30px;

            color: #cbcbcb;

            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .dropdown-select-options {
        background-color: rgb(30, 30, 30);
        border: 2px solid rgb(50, 50, 50);
        border-radius: 8px;

        display: flex;
        flex-direction: column;
        
        gap: 10px;
        padding: 10px;
        
        position: fixed;
        margin-top: 38px;

        .dropdown-option {
            width: 100%;
            height: 22px;

            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 14px;

            color: whitesmoke;
            font-family: "Roboto Mono", monospace;
            background-color: rgb(40, 40, 40);

            border-radius: 6px;
            padding: 16px;

            user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-user-select: none;

            &:hover {
                background-color: rgb(50, 50, 50);
            }
        }
    }
</style>