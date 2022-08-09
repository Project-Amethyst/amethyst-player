<script lang="ts">
    import Bookmark from "carbon-icons-svelte/lib/Bookmark.svelte"
    import BookmarkFilled from "carbon-icons-svelte/lib/BookmarkFilled.svelte"
    import User from "carbon-icons-svelte/lib/User.svelte"
    import Music from "carbon-icons-svelte/lib/Music.svelte"
    import MusicRemove from "carbon-icons-svelte/lib/MusicRemove.svelte"
    import InProgress from "carbon-icons-svelte/lib/InProgress.svelte"
    import OverflowMenuVertical from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte"
    import Pause from "carbon-icons-svelte/lib/Pause.svelte"
    import Play from "carbon-icons-svelte/lib/Play.svelte"
    import ChevronLeft from "carbon-icons-svelte/lib/ChevronLeft.svelte"
    import ChevronRight from "carbon-icons-svelte/lib/ChevronRight.svelte"
    import Settings from "carbon-icons-svelte/lib/Settings.svelte"
    import USB from "carbon-icons-svelte/lib/USB.svelte"
    import LogoGithub from "carbon-icons-svelte/lib/LogoGithub.svelte"

    import Button from "./Button.svelte";
    import Slider from "./Slider.svelte";

    import { goto } from "$app/navigation";

    import { createEventDispatcher } from 'svelte';

    import type {ProjectRT} from "../engine/ProjectRT";

    export let project:ProjectRT;
    export let status:string;

    let autoplay_available:boolean;
    $: autoplay_available = project?.Autoplay === undefined;

    let author:string;
    let name:string;
    $: author = project?.projectInfo.author;
    $: name = project?.projectInfo.name;

    $: project = project;

    let dispatch = createEventDispatcher();

    let projectBookmarked = false

    let demoplayValues = {
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

        {#if status === "not loaded"}
            <div class="sidebar-block-project-info">
                <span class="block-title">Project Information</span>
                <div class="block-side-parent">
                    <div class="block-side-left">
                        <div class="block-info-bar">
                            <div class="info-icon">
                                <div class="info-icon">
                                    <MusicRemove size={24}/>
                                </div>
                            </div>
                            <span>No Project Loaded</span>
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <Button on:click={() => dispatch("loadProject")}>Load Project</Button>
                </div>
            </div>
        {/if}

        {#if status === "loading"}
            <div class="sidebar-block-project-info">
                <span class="block-title">Project Information</span>
                <div class="block-side-parent">
                    <div class="block-side-left">
                        <div class="block-info-bar">
                            <div class="info-icon">
                                <div class="info-icon">
                                    <InProgress size={24}/>
                                </div>
                            </div>
                            <span>Project Loading In Progress...</span>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        {#if status === "loaded"}
            <div class="sidebar-block-project-info">
                <span class="block-title">Project Information</span>

                <div class="block-side-parent">
                    <div class="block-side-left">
                        <div class="block-info-bar">
                            <div class="info-icon">
                                <div class="info-icon">
                                    <User size={24}/>
                                </div>
                            </div>
                            <span>{project?.projectInfo.author}</span>
                        </div>

                        <div class="block-info-bar">
                            <div class="info-icon">
                                <Music size={24}/>
                            </div>

                            <span>{project?.projectInfo.name}</span>
                        </div>
                    </div>

                    <!-- <div class="block-side-right">
                        <button class="fav-btn" on:click={() => bookmarkProject()}>
                            {#if projectBookmarked}
                                <BookmarkFilled size={28}/>
                            {:else}
                                <Bookmark size={28}/>
                            {/if}
                        </button>
                    </div> -->
                </div>

                <!-- <a class="community-button">
                    <u>
                        <i>Open Community Page</i>
                    </u>
                </a> -->

                <div style="text-align: center; margin-top: 20px;">
                    <Button on:click={() => dispatch("loadProject")}>Change Project</Button>
                </div>
            </div>
            
            {#if autoplay_available}
                <div class="sidebar-block-demoplay">
                    <div>
                        <span class="block-title">Project Demoplay
                            <!-- <OverflowMenuVertical size={24}></OverflowMenuVertical>  -->
                        </span>
                        
                    </div>

                    <div class="demoplay-time">
                        <span class="time-display">00:00</span>

                        <Slider/>

                        <span class="time-display">00:00</span>
                    </div>
                    <div class="demoplay-control-block">
                        <div class="demoplay-button">
                            <div>
                                <ChevronLeft size={26}></ChevronLeft>
                            </div>
                        </div>
                        <div class="demoplay-button">
                            <div on:click={() => demoplayValues.isPlaying = !demoplayValues.isPlaying}>
                                {#if demoplayValues.isPlaying}
                                    <Pause size={24}></Pause>
                                {:else}
                                    <Play size={24}></Play>
                                {/if}
                            </div>
                        </div>
                        <div class="demoplay-button">
                            <div>
                                <ChevronRight size={26}></ChevronRight>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
    </div>

    <div style="height: 100%"></div>

    <div class="sidebar-bottom-block">
        <div class="icon-button">
            <div on:click={() => dispatch("settings")}>
                <Settings size={32}></Settings>
            </div>
        </div>

        <div class="icon-button">
            <div on:click={() => {console.log(project); console.log(project?.projectInfo.author); console.log(name); console.log(project?.projectInfo === undefined)}}>
                <USB size={32}></USB>
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

        .sidebar-block-demoplay {
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

            .demoplay-time {
                display: flex;
                
                margin-top: 14px;
                margin-bottom: 2px;

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
            .demoplay-control-block {
            height: 60px;
            width: 100%;

            display: flex;


                .demoplay-button {
                    height: 60px;
                    width: 100%;

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
        }

        .sidebar-bottom-block {
            height: 60px;
            width: 100%;

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