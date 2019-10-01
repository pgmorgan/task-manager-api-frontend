<template>
    <div class="container">
        <h1>Routing</h1>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/loggedin">Logged In</router-link></li>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
    }
</script>

<style>
</style>
