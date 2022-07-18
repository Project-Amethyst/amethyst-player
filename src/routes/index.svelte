<!-- Index file for the player route -->
<script lang="ts">
  import type { KeyID, KeyPress, KeyRelease } from "src/types/devices";

  import { virtualDeviceComponents } from "../components/devices/Devices";
	
	import type {ProjectRT} from "../engine/ProjectRT"
	import {projectEngines} from "../engine/Engines"

  import SettingsIcon from "carbon-icons-svelte/lib/Settings.svelte";
  import MusicIcon from "carbon-icons-svelte/lib/Music.svelte";
  import FolderIcon from "carbon-icons-svelte/lib/FolderAdd.svelte";

  import Popup from "../components/Popup.svelte";
  import Dropdown from "../components/Dropdown.svelte";

  import { onMount, SvelteComponent } from "svelte";
  import "../shared.css";

  let settings = {
    virtualDevice: Object.keys(virtualDeviceComponents)[0],
  };

  let virtualDeviceComponent: typeof virtualDeviceComponents[number]["component"];
  $: virtualDeviceComponent =
    virtualDeviceComponents[settings.virtualDevice].component;

  let device: any; //Should be fine
	let engine: ProjectRT = projectEngines["Unipack"](); //this will be unipack atm. Make it changeable in the future.

  let showSettings: boolean;

  const virtualKeyPressed: KeyPress = (keyID: KeyID) => {
    console.info(`Virtual Button ${keyID} has been pressed`);
    device.rgb_led(keyID, 255, 255, 255);
  };

  const virtualKeyReleased: KeyRelease = (keyID: KeyID) => {
    console.info(`Virtual Button ${keyID} has been released`);
    device.rgb_led(keyID, 0, 0, 0);
  };

  const calculateDeviceScale = () => {
    // TODO: i guess ?
  };

  const loadProject = () => {
    console.log("Load File Selector");
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      var file = e?.target?.files[0];
      console.log(file);
    };
    input.click();
  };
</script>

<main>
  <div
    class="amethyst-player-header center-class"
    style="justify-content: flex-start"
  >
    <div class="center-class" style="gap: 20px; margin-left: 10px;">
      <img src="logo-256.png" alt="Amethyst's logo" width="75" height="75" />

      <span>Amethyst Player</span>
    </div>
  </div>

  <div class="main-content">
    <div class="sidebar-part">
      <div class="sidebar-block">
        <div class="icon-holder">
          <img
            alt="Clementshow's icon"
            height="50%"
            style="border-radius: 50%; border: 2px solid rgb(80, 80, 80);"
            src="https://yt3.ggpht.com/f4s7T6OpDAjpOLZTPXfkKCIxiIbq5qWsBtNxmfq4x3WI6TMkDnYnMSPVhRNbNowS8gGI3M5ymzU=s88-c-k-c0x00ffffff-no-rj"
          />
        </div>

        <div class="control-holder creator-name">
          <span>Clementshow</span>
        </div>
      </div>

      <div class="sidebar-block">
        <div class="icon-holder">
          <MusicIcon size={32} />
        </div>

        <div class="control-holder song-info">
          <span class="song-artist">Alan Walker</span>
          <span class="song-title">The Spectre</span>
        </div>
      </div>

      <div style="height: 100%;" />

      <div class="sidebar-block clickable" on:click={loadProject}>
        <div class="icon-holder">
          <FolderIcon size={32} />
        </div>

        <div class="control-holder left-text">
          <span>Open local Project</span>
        </div>
      </div>

      <div
        class="sidebar-block clickable"
        on:click={() => (showSettings = true)}
      >
        <div class="icon-holder">
          <SettingsIcon size={32} />
        </div>

        <div class="control-holder left-text">
          <span>Settings</span>
        </div>
      </div>
    </div>

    <div class="content-part">
      <div class="amethyst-player-content">
        <div class="amethyst-player-launchpad-holder center-class">
          <div
            style="height: 50vh; width: 50vh; padding: 20px;"
            class="center-class"
          >
            <svelte:component
              this={virtualDeviceComponent}
              bind:this={device}
              keyPress={virtualKeyPressed}
              keyRelease={virtualKeyReleased}
            />
          </div>
        </div>
      </div>

      <div class="amethyst-player-footer center-class">
        <span>Amethyst Player (Alpha)</span>
        <!-- <span>Maintained by <a href="https://github.com/anthonyhfm" target="_blank">anthonyhfm</a>, <a href="https://github.com/203Null" target="_blank">203null</a>, <a href="https://github.com/Vexcited" target="_blank">vexcited</a> and <a href="https://github.com/mtgsquad" target="_blank">molai</a></span> -->
      </div>
    </div>
  </div>

  <Popup bind:show={showSettings}>
    <div class="settings-popup">
      <div class="popup-header center-class">
        <span>Settings</span>
      </div>

      <div class="setting">
        <div class="setting-name">
          <span>Virtual Device:</span>
        </div>

        <div class="setting-option">
          <Dropdown
            bind:value_str={settings.virtualDevice}
            options={Object.keys(virtualDeviceComponents)}
          />
        </div>
      </div>

      <div class="setting">
        <div class="setting-name">
          <span>Language</span>
        </div>

        <div class="setting-option">
          <Dropdown options={["🇺🇸 English"]} />
        </div>
      </div>
    </div>
  </Popup>
</main>

<style lang="scss">
  main {
    background-color: #1d1d1d;
    height: 100vh;
    width: 100vw;
  }

  .center-class {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .amethyst-player-header {
    height: 100px;

    background-color: rgb(20, 20, 20);
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border-bottom: 3px inset rgb(10, 10, 10);

    gap: 20px;

    span {
      color: #f1f1f1;

      font-family: "Roboto Mono", sans-serif;
      font-weight: 700;
      font-size: 32px;
      letter-spacing: 0.1rem;
    }

    .settings-icon {
      width: 100px;
      height: 100px;
      position: fixed;
      left: calc(100vw - 100px);

      button {
        height: 38px;
        width: 38px;
        padding: 0;
        background: transparent;
        border: none;
        color: whitesmoke;
        transition: transform 0.2s ease-in-out;

        &:hover {
          transform: rotateZ(45deg);
          color: #c5c5c5;
        }
      }
    }
  }

  .main-content {
    display: flex;
    flex-direction: row;

    .sidebar-part {
      width: 100px;
      background-color: rgb(20, 20, 20);
      transition: width 0.4s ease-in-out;
      box-shadow: 0 0 10px 2px black;
      overflow: hidden;

      display: flex;
      flex-direction: column;

      &:hover {
        width: 450px;
      }

      .sidebar-block {
        width: 450px;
        height: 100px;

        display: flex;

        &.clickable {
          transition: background-color 0.1s ease-in-out;
          cursor: pointer;

          &:hover {
            background-color: rgb(10, 10, 10);
          }
        }

        .icon-holder {
          height: 100px;
          width: 100px;

          display: flex;
          justify-content: center;
          align-items: center;

          color: #b9b9b9;
        }

        .control-holder {
          height: 100px;
          width: 250px;

          &.creator-name {
            display: flex;
            align-items: center;
            justify-content: center;

            span {
              color: rgb(200, 200, 200);

              font-family: "Roboto Mono", sans-serif;
              font-weight: 600;
              font-size: 28px;
              padding: 5px 10px;
            }
          }

          &.song-info {
            display: flex;
            align-items: center;
            justify-content: center;

            gap: 5px;

            flex-direction: column;

            font-family: "Roboto Mono", monospace;

            font-size: 18px;

            span.song-artist {
              color: aqua;
            }

            span.song-title {
              color: rgb(200, 200, 200);
            }
          }

          &.left-text {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            font-family: "Roboto Mono", monospace;

            font-size: 20px;

            color: rgb(200, 200, 200);
          }
        }
      }
    }

    .content-part {
      width: 100%;
    }
  }

  .amethyst-player-info {
    height: 100px;

    img {
      border-radius: 50%;
      border: 2px solid #474747;
    }
  }

  .amethyst-player-content {
    height: calc(100vh - 200px);
    width: 100%;

    overflow: auto;

    .amethyst-player-launchpad-holder {
      height: calc(100%);
    }
  }

  .amethyst-player-footer {
    height: 100px;
    width: 100%;
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

  .settings-popup {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .popup-header {
      height: 30px;
      font-size: 26px;

      font-family: "Roboto Mono", sans-serif;
      color: whitesmoke;
      font-weight: 300;

      margin-bottom: 20px;
    }

    .setting {
      height: 35px;

      display: flex;
      align-items: center;

      .setting-name {
        width: 250px;
        display: flex;
        align-items: center;

        color: whitesmoke;

        font-family: "Roboto Mono", sans-serif;
        font-weight: 400;
      }

      .setting-option {
        min-width: 250px;
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
</style>
