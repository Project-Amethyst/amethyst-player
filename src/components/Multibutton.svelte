<script>
    import '../shared.css';

    export let options = [];
    export let value;
</script>

<div class={$$props.class} style={$$props.style}>
    {#each options as option}
        <button on:click={() => value = option} class="{option === value? 'active' : ''}  {option === options[0]? 'left' : option === options[options.length - 1]? 'right' : '' }">{option}</button>
    {/each}
</div>

<style lang="scss">
    div {
        display: inline-block;
        width: fit-content;
    }

    button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        padding: 5px 10px;

        background-color: rgb(20, 20, 20);
        border: 1px solid rgb(40, 40, 40);
        border-top: 2px solid rgb(40, 40, 40);
        border-bottom: 2px solid rgb(40, 40, 40);

        font-size: 14px;

        font-family: "Roboto Mono", monospace;

        color: #dedede;

        &.left {
            padding: 5px 10px;

            border-left: 2px solid rgb(40, 40, 40);
            border-radius: 8px 0 0 8px;
        }

        &.right {
            padding: 5px 10px;

            border-right: 2px solid rgb(40, 40, 40);
            border-radius: 0 8px 8px 0;
        }

        &.active {
            background-color: #323232;
        }
    }
</style>