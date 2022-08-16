<script>
    export let checked = false;
    let switchBody;
</script>

<div bind:this={switchBody} class="switch-body {checked? 'toggled' : ''}" on:click={() => checked = !checked}>
    <div class="switch-thumb"></div>
</div>

<style lang="scss">
    .switch-body {
        display: inline-flex;

        height: 34px;
        width: 60px;

        background-color: rgb(20, 20, 20);
        border: 2px solid rgb(40, 40, 40);

        border-radius: 34px;

        align-items: center;

        padding-left: 8px;
        padding-right: 8px;

        transition: flex-direction 0.2s, width 0.3s;

        flex-direction: row;

        &.toggled {
            .switch-thumb {
                width: 100%;
                background-color: #75ea5a;

                transition: width 0.2s, background-color 0.1s 0.1s;
            }
        }

        .switch-thumb {
            height: 16px;
            width: 16px;
            background-color: rgb(40, 40, 40);
            border-radius: 14px;

            transition: width 0.2s, background-color 0.1s 0.1s;
        }
    }
</style>