<script>
    export let active = true;
</script>

<div class="mobile-sidebar-parent {active? 'active-sidebar' : ''}">
    <div class="mobile-sidebar">

    </div>
</div>

<style lang="scss">
    .mobile-sidebar-parent {
        position: fixed;
        width: 0;
        top: 60px;
        height: calc(100% - 60px);

        transition: width 0.4s ease-in-out;

        overflow: hidden;

        &.active-sidebar {
            width: 100vw;
        }
    }

    .mobile-sidebar {
        width: 100vw;
        height: 100%;
        background: rgb(20, 20, 20);
    }
</style>