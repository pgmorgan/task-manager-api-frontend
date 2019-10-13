<template>
    <div class="homePage">
        <h1>Settings</h1>
        <button class="btn autoWidth" v-on:click.prevent="navToSettings()">Go Back</button>
        <hr>
        <h3><b>Are you sure you want to delete your account?</b></h3>
        <h4>All data associated with this account will be removed</h4>
        <button class="btn autoWidth" v-on:click.prevent="deleteAccount()">Delete my Account</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            token:              "",
        }
    },
    created() {
        const loadedToken = localStorage.getItem('token')
        if (!loadedToken) {
            this.$router.push('/')
            return
        }
        this.token = loadedToken 
    },
    methods: {
        navToSettings() {
            this.$router.push('/settings')
        },
        deleteAccount() {
            this.$http.delete(process.env.VUE_APP_API_URL + '/users/me', {
                headers: {
                    Authorization:  'Bearer ' + this.token
                }
            }).then(response => {
                this.$router.push('/')
            }, error => {
                console.log(error)
            })
        },
    },
    watch: {
    },
}
</script>

<style>
</style>