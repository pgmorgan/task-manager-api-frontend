<template>
    <div id="page">
        <span class="besideBody"></span>
        <router-view class="body"></router-view>
        <span class="besideBody"></span>
    </div>
</template>

<script>
    export default {
    }
</script>

<style>
    #page {
        display:    flex;
        flex-flow:  row nowrap;
        justify-content:        space-between;
    }

    .body {
        width:      100vw;
        max-width:  1200px;
        border:     1px solid pink;
    }
</style>
