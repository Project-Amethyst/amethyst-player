<!-- Index file for the player route -->

<script lang="ts">
    import LaunchpadProMk2 from "../../components/devices/LaunchpadProMk2.svelte";

    import {Pause} from "carbon-icons-svelte";
</script>

<main>
    <div class="amethyst-player-header">
        <img src="logo-256.png" width="75" height="75">

        <span>Amethyst Player</span>
    </div>

    <div class="amethyst-player-info">
        <img height="40" src="https://yt3.ggpht.com/f4s7T6OpDAjpOLZTPXfkKCIxiIbq5qWsBtNxmfq4x3WI6TMkDnYnMSPVhRNbNowS8gGI3M5ymzU=s88-c-k-c0x00ffffff-no-rj">

        <span class="creator-name">Clementshow</span>

        <span class="song-info">
            <span class="song-artist">Alan Walker</span>
            -
            <span class="song-title">The Spectre</span>
        </span>
    </div>

    <div class="amethyst-player-content">
        <div class="amethyst-player-launchpad-holder">
            <div style="transform: scale(1.5)">
                <LaunchpadProMk2/>
            </div>
        </div>
    </div>

    <div class="amethyst-player-footer">
        <span>Amethyst Player (Web)</span>
        <span>Maintained by <a href="">anthonyhfm</a>, <a href="">203null</a>, <a href="">vexcited</a> and <a href="">molai</a></span>
    </div>
</main>

<style lang="scss">
    main {
        background-color: #1D1D1D;
        height: 100vh;
        width: 100vw;
    }

    .amethyst-player-header {
        height: 100px;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgb(20, 20, 20);

        gap: 20px;

        span {
            color: #f1f1f1;

            font-family: 'Roboto Mono', sans-serif;
            font-weight: 700;
            font-size: 32px;
            letter-spacing: 0.1rem;
        }
    }

    .amethyst-player-info {
        height: 100px;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            border-radius: 50%;
            border: 2px solid #474747;
        }

        span.creator-name {
            color: #f1f1f1;

            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            font-size: 18px;
            margin-left: 15px;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #2c2c2c;
            letter-spacing: 0.1rem;
        }

        span.song-info {
            color: #f1f1f1;

            font-family: 'Roboto Mono', monospace;
            font-weight: 500;
            font-size: 18px;
            margin-left: 20px;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #2c2c2c;
            letter-spacing: 0.1rem;

            span.song-title {
                color: aqua;
            }
        }
    }

    .amethyst-player-content {
        height: calc(100vh - 300px);
        width: 100vw;

        overflow: auto;

        .amethyst-player-launchpad-holder {
            height: calc(100%);

            display: flex;
            justify-content: center;
            align-items: center;
        }

    }

    .amethyst-player-footer {
        height: 100px;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        span {
            font-size: 18px;

            font-family: "Roboto Mono", sans-serif;
            color: #969696;
            font-weight: 300;

            a {
                color: aqua;

                &:hover {
                    color: #0ec0c0;
                }
            }
        }
    }
</style>