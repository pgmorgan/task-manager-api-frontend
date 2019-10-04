<template>
    <div id="page">
        <span class="besideBody"></span>
        <div id="centerBody">
            <router-view class="body"></router-view>
        </div>
        <span class="besideBody"></span>
    </div>
</template>

<script>
    export default {
    }
</script>

<style>
    #page {
        display:                flex;
        flex-flow:              row nowrap;
        justify-content:        space-between;
    }

    .body {
        width:                  100vw;
        max-width:              1200px;
    }

    body {
        background-image:       url(./assets/background.jpg);
        min-height:             100%;
        background-repeat:      no-repeat;
        background-attachment:  fixed;
        background-position:    center;
        background-size:        cover;
    }

    #centerBody {
        background:             rgba(255, 255, 255, 0.5);
    }
</style>
