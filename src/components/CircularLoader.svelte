<div class="loader">
    <svg class="circular-loader"viewBox="25 25 50 50" >
        <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" stroke-width="2" />
    </svg>
</div>

<style lang="scss">
    .loader {
        position: relative;
        margin: 0px auto;
        width: 100px;
        height: 100px;
    }

    .profile-main-loader .loader:before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .circular-loader {
        -webkit-animation: rotate 2s linear infinite;
        animation: rotate 2s linear infinite;
        height: 100%;
        -webkit-transform-origin: center center;
        -ms-transform-origin: center center;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        margin: auto;
    }

    .loader-path {
        stroke-dasharray: 150,200;
        stroke-dashoffset: -10;
        -webkit-animation: dash 1.5s ease-in-out infinite;
        animation: dash 1.5s ease-in-out infinite;
        stroke-linecap: round;

        stroke: #bb03ff;
    }

    @-webkit-keyframes rotate {
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes rotate {
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes dash {
        0% {
            stroke-dasharray: 1,200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -124;
        }
    }
    @keyframes dash {
        0% {
            stroke-dasharray: 1,200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 89,200;
            stroke-dashoffset: -124;
        }
    }
</style>