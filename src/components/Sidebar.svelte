<script>
    import Bookmark from "carbon-icons-svelte/lib/Bookmark.svelte"
    import BookmarkFilled from "carbon-icons-svelte/lib/BookmarkFilled.svelte"
    import Music from "carbon-icons-svelte/lib/Music.svelte"
    import Pause from "carbon-icons-svelte/lib/Pause.svelte"
    import Play from "carbon-icons-svelte/lib/Play.svelte"
    import Settings from "carbon-icons-svelte/lib/Settings.svelte"
    import LogoGithub from "carbon-icons-svelte/lib/LogoGithub.svelte"

    import Button from "./Button.svelte";
    import Slider from "./Slider.svelte";

    import { goto } from "$app/navigation";

    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();


    let projectBookmarked = false

    let autoplayValues = {
        isPlaying: false,
        playProgress: 0
    }

    function bookmarkProject() {
        projectBookmarked = !projectBookmarked
    }

    function changeProject() {

    }
</script>

<div class="sidebar">
    <div>
        <div class="sidebar-header">
            <img src="logo-256.png">

            <span class="title">Amethyst</span>
            <span class="subtitle">Player</span>
        </div>

        <div class="sidebar-block-project-info">
            <span class="block-title">Project Information</span>

            <div class="block-side-parent">
                <div class="block-side-left">
                    <div class="block-info-bar">
                        <div class="info-icon">
                            <img src="https://yt3.ggpht.com/f4s7T6OpDAjpOLZTPXfkKCIxiIbq5qWsBtNxmfq4x3WI6TMkDnYnMSPVhRNbNowS8gGI3M5ymzU=s88-c-k-c0x00ffffff-no-rj">
                        </div>

                        <span>Project Creator Info</span>
                    </div>

                    <div class="block-info-bar">
                        <div class="info-icon">
                            <Music size={24}/>
                        </div>

                        <span>Artist - Project Song</span>
                    </div>
                </div>

                <div class="block-side-right">
                    <button class="fav-btn" on:click={() => bookmarkProject()}>
                        {#if projectBookmarked}
                            <BookmarkFilled size={28}/>
                        {:else}
                            <Bookmark size={28}/>
                        {/if}
                    </button>
                </div>
            </div>

            <a class="community-button">
                <u>
                    <i>Open Community Page</i>
                </u>
            </a>

            <div style="text-align: center; margin-top: 20px;">
                <Button on:click={changeProject}>Change Project</Button>
            </div>
        </div>

        <div class="sidebar-block-autoplay">
            <span class="block-title">Project Autoplay</span>

            <div class="autoplay-controls">
                <span class="time-display">00:00</span>

                <Slider/>

                <span class="time-display">00:00</span>
            </div>

            <div class="autoplay-play-pause">
                <div on:click={() => autoplayValues.isPlaying = !autoplayValues.isPlaying}>
                    {#if autoplayValues.isPlaying}
                        <Pause size={24}></Pause>
                    {:else}
                        <Play size={24}></Play>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div style="height: 100%"></div>

    <div class="sidebar-bottom-block">
        <div class="icon-button">
            <div on:click={() => dispatch("settings")}>
                <Settings size={32}></Settings>
            </div>
        </div>

        <div class="icon-button">
            <div on:click={() => goto("https://github.com/anthonyhfm/amethyst-player")}>
                <LogoGithub size={32}></LogoGithub>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .sidebar {
        width: 400px;
        background-color: rgb(20, 20, 20);
        box-shadow: 0 0 10px 0.5px black;
        overflow: hidden;

        display: flex;
        flex-direction: column;

        .sidebar-header {
            height: 75px;

            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;

            img {
                height: 52px;
            }

            span.title {

                font-family: 'Roboto', sans-serif;
                font-style: normal;
                font-weight: 300;
                font-size: 24px;

                letter-spacing: 0.125rem;
                color: #f5f5f5;
            }

            span.subtitle {
                position: fixed;
                margin-left: 0.8rem;
                margin-top: 2.5rem;

                font-family: 'Roboto', sans-serif;
                font-style: normal;
                font-weight: 300;
                font-size: 16px;

                letter-spacing: 0.125rem;
                color: rgba(245, 245, 245, 0.38);
            }
        }

        .sidebar-block-project-info {
            margin-top: 30px;
            height: 200px;
            padding: 20px;
            gap: 10px;

            display: flex;
            flex-direction: column;

            a.community-button {
                margin-top: 30px;
                text-align: center;

                font-family: 'Roboto', sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 18px;
                color: #80D2E4;

                transition: color 0.1s;

                cursor: pointer;

                &:hover {
                    color: #5093a2;
                }
            }

            .block-title {
                font-family: 'Roboto', sans-serif;
                font-style: normal;
                font-weight: 300;
                font-size: 20px;

                color: rgba(245, 245, 245, 0.52);
                margin-bottom: 10px;
            }

            .block-side-parent {
                display: flex;

                .block-side-left {
                    height: fit-content;
                    width: 100%;

                    display: flex;
                    flex-direction: column;

                    gap: 10px;

                    .block-info-bar {
                        height: 30px;
                        display: flex;

                        .info-icon {
                            width: 30px;
                            height: 30px;

                            display: flex;
                            justify-content: center;
                            align-items: center;

                            color: #fff;

                            img {
                                height: 30px;
                                border-radius: 50%;
                            }
                        }

                        span {
                            line-height: 30px;
                            text-indent: 10px;

                            font-family: 'Roboto', sans-serif;
                            font-style: normal;
                            font-weight: 300;
                            font-size: 16px;

                            color: #cbcbcb;
                        }
                    }
                }

                .block-side-right {
                    height: 100%;
                    width: 40px;

                    button.fav-btn {
                        width: 40px;
                        height: 40px;
                        color: white;

                        text-align: right;

                        cursor: pointer;
                    }
                }
            }
        }

        .sidebar-block-autoplay {
            margin-top: 150px;
            height: 200px;
            padding: 20px;

            gap: 10px;

            display: flex;
            flex-direction: column;

            .block-title {
                font-family: 'Roboto', sans-serif;
                font-style: normal;
                font-weight: 300;
                font-size: 20px;

                color: rgba(245, 245, 245, 0.52);
                margin-bottom: 10px;
            }

            .autoplay-controls {
                display: flex;

                .time-display {
                    font-family: 'Roboto', sans-serif;
                    font-style: normal;
                    font-weight: 300;
                    font-size: 16px;

                    user-select: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                    -moz-user-select: none;

                    color: #696969;
                }
            }

            .autoplay-play-pause {
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    height: 50px;
                    width: 50px;

                    background-color: rgb(20, 20, 20);
                    border: 2px solid rgb(40, 40, 40);
                    border-radius: 50%;

                    color: #d5d5d5;
                }
            }
        }

        .sidebar-bottom-block {
            height: 60px;

            display: flex;

            margin-bottom: 10px;

            .icon-button {
                height: 60px;
                width: 100%;

                display: flex;
                justify-content: center;
                align-items: center;

                color: grey;
            }
        }
    }
</style>