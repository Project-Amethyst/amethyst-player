<script lang="ts">
    export let show: boolean;
    export let manuallyExittable: boolean = true;
    export let clearPopup: boolean = false;
    export let mobile;

    export function clickOutside(node: HTMLDivElement) {
        const handleClick = (event: MouseEvent) => {
            if (!event.target) return;
            const target = event.target as HTMLElement;

            if (!node.contains(target)) {
              show = false
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

<div class="popup-element {show? 'active' : 'inactive'}">
    {#if show && !clearPopup}
        <div class="popup-inner {mobile? 'mobile-popup': ''}" use:clickOutside>
            <slot />
        </div>
    {:else if show && clearPopup}
        <slot />
    {/if}
</div>

<style lang="scss">
    .popup-element {
        z-index: 9999;

        transition: background-color 0.2s ease-in-out;

        display: flex;
        justify-content: center;
        align-items: center;

        &.active {
            position: fixed;
            top: 0;
            left: 0;

            height: 100vh;
            width: 100vw;

            background-color: rgba(0, 0, 0, 0.48);
            backdrop-filter: blur(8px);
        }

        &.inactive {
            position: fixed;
            top: 0;
            left: 0;

            height: 0;
            width: 0;

            background-color: rgba(0, 0, 0, 0);
        }

        .popup-inner {
            max-width: 90vw;
            padding: 20px;
            background-color: rgb(20, 20, 20);
            border-radius: 10px;
            border: 2px solid rgb(50, 50, 50);
            box-shadow: 0 0 20px 10px black;

            &.mobile-popup {
                max-width: 100vw;
                max-height: 100vh;
                overflow-y: auto;
                border-radius: initial;
                border: initial;
            }
        }
    }
</style>