<script lang="ts">
    import Bookmark from"carbon-icons-svelte/lib/Bookmark.svelte"
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
    import Usb from "carbon-icons-svelte/lib/Usb.svelte"
    import LogoGithub from "carbon-icons-svelte/lib/LogoGithub.svelte"

    import Button from "./Button.svelte";
    import Slider from "./Slider.svelte";

    import { goto } from "$app/navigation";

    import { createEventDispatcher, afterUpdate, onMount} from 'svelte';
    import { t, locales } from '$lib/translations'; 

    import type {ProjectRT} from "../engine/ProjectRT";
    import { Stop } from "carbon-icons-svelte"

    export let project:ProjectRT;
    export let status:string;

    let dispatch = createEventDispatcher();

    let projectBookmarked = false

    let demoplayValues = {
        isPlaying: false,
        playProgress: 0
    }

    function bookmarkProject() {
        projectBookmarked = !projectBookmarked
    }

    onMount(() => {
        setInterval(() => {
        if(demoplayValues.playProgress != project?.demoplay?.progress)
            demoplayValues.playProgress = project?.demoplay?.progress;

        if(demoplayValues.isPlaying != (project?.demoplay?.status === "PLAYING"))
            demoplayValues.isPlaying = project?.demoplay?.status === "PLAYING";
    }, 1000/30)});
</script>

<div class="sidebar {$$props.class}" style={$$props.style}>
    <div>
        <div class="sidebar-header">
            <img src="logo-256.png" style="margin-top: 12px;">

            <span class="title" style="margin-left: -18px;">Amethyst</span>
            <span class="subtitle" style="margin-left: -5px;">Player</span>
        </div>

        {#if status === "not loaded"}
            <div class="sidebar-block-project-info">
                <span class="block-title">{$t('sidebar.project_infomation')}</span>
                <div class="block-side-parent">
                    <div class="block-side-left">
                        <div class="block-info-bar">
                            <div class="info-icon">
                                <div class="info-icon">
                                    <MusicRemove size={24}/>
                                </div>
                            </div>
                            <span>{$t('sidebar.no_project_loaded')}</span>
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <Button on:click={() => dispatch("loadProject")}>{$t('sidebar.load_project')}</Button>
                </div>
            </div>
        {/if}

        {#if status === "loading"}
            <div class="sidebar-block-project-info">
                <span class="block-title">{$t('sidebar.project_infomation')}</span>
                <div class="block-side-parent">
                    <div class="block-side-left">
                        <div class="block-info-bar">
                            <div class="info-icon">
                                <div class="info-icon">
                                    <InProgress size={24}/>
                                </div>
                            </div>
                            <span>{$t('sidebar.project_loading_in_progress')}</span>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        {#if status === "loaded"}
            <div class="sidebar-block-project-info">
                <span class="block-title">{$t('sidebar.project_infomation')}</span>

                <div class="block-side-parent">
                    <div class="block-side-left">
                        <div class="block-info-bar">
                            <div class="info-icon">
                                <div class="info-icon">
                                    <User size={24}/>
                                </div>
                            </div>
                            <span title={project?.projectInfo.author}>{project?.projectInfo.author}</span>
                        </div>

                        <div class="block-info-bar">
                            <div class="info-icon">
                                <Music size={24}/>
                            </div>

                            <span title={project?.projectInfo.name}>{project?.projectInfo.name}</span>
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
                    <Button on:click={() => dispatch("loadProject")}>{$t('sidebar.change_project')}</Button>
                </div>
            </div>
            
            {#if project?.demoplay !== undefined}
                <div class="sidebar-block-demoplay">
                    <div style="display: flex; color: gray; align-items: center; gap: 5px;" on:click={() => dispatch("demoplay")}>
                        <span class="block-title">{$t('sidebar.project_demoplay')}</span>

                        <OverflowMenuVertical style="margin-top: -10px;margin-left: -4px;" size={24}></OverflowMenuVertical>
                    </div>

                    <div class="demoplay-time">
                        <div class="time-display">
                            <span >{demoplayValues.playProgress}</span>
                        </div>

                        <Slider min={0} value={demoplayValues.playProgress} max={project?.demoplay?.total} on:change={e => project.demoplay.Seek(e.detail)}/>

                        <div class="time-display">
                            <span >{project?.demoplay?.total}</span>
                        </div>
                    </div>

                    <div class="demoplay-control-block">
                        <div class="demoplay-button">
                            <div on:click={() => project?.demoplay?.Previous()}>
                                <ChevronLeft size={26}></ChevronLeft>
                            </div>
                        </div>
                        <div class="demoplay-button">
                            <div on:click={() => project?.demoplay?.status === "PLAYING" ? project?.demoplay?.Pause() : project?.demoplay?.Start()}>
                                {#if demoplayValues.isPlaying}
                                    <Pause size={24}></Pause>
                                {:else}
                                    <Play size={24}></Play>
                                {/if}
                            </div>
                        </div>
                        <div class="demoplay-button">
                            <div on:click={() => project?.demoplay?.Next()}>
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
            <div on:click={() => dispatch("devices")}>
                <Usb size={36}></Usb>
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
        min-width: 400px;
        max-width: 400px;
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
                            white-space: nowrap;
                            max-width: 80%;
                            overflow: hidden;
                            text-overflow: ellipsis;

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
                    max-width: 36px;
                    min-width: 36px;

                    text-align: center;

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

                        &:hover {
                            background-color: rgb(10, 10, 10);
                            border: 2px solid rgb(31, 31, 31);

                            color: #c5c5c5;
                        }
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

    @media only screen and (max-width: 600px) {
        .sidebar {
            display: none;
        }
    }
</style>