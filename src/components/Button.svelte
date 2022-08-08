<script>
    import "../shared.css"

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();
</script>

<button class={$$props.class} style={$$props.style} on:click={() => dispatch("click")}>
    <span>
        <slot/>
    </span>
</button>

<style lang="scss">
    button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        padding: 5px 15px;
        border-radius: 8px;

        background-color: rgb(20, 20, 20);
        border: 2px solid rgb(40, 40, 40);

        span {
            font-family: "Roboto Mono", monospace;

            color: #dedede;
        }
    }
</style>