<script>
    export let checked = false;
</script>

<div class="button-body {checked? 'active' : ''}" on:click={() => checked = !checked}>
    <div class="line top-line"></div>

    <div class="line bottom-line"></div>
</div>

<style lang="scss">
    .button-body {
        height: 46px;
        width: 46px;

        display: flex;
        justify-content: center;
        align-items: center;

        .line {
            position: fixed;

            width: 36px;
            height: 3px;
            background: #f5f5f5;

            transition: transform 0.2s ease-in-out, margin-bottom 0.2s ease-in-out, margin-top 0.2s ease-in-out;
        }

        .top-line {
            margin-bottom: 15px;
        }

        .bottom-line {
            margin-top: 15px;
        }

        &.active {
            .top-line {
                margin-bottom: 0;

                transform: rotateZ(45deg);
            }

            .bottom-line {
                transform: rotateZ(-45deg);

                margin-top: 0;
            }
        }
    }
</style>