<template>
    <div>
        <h1>The Logged In Page</h1>
        <hr>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab asperiores, aut autem, blanditiis consequuntur
            dolore excepturi laborum maiores minima nihil non nulla obcaecati quas quibusdam quod sed suscipit vero
            voluptatem.</p>
        <button v-on:click="navigateToHome">Go to Home</button>

    </div>
</template>

<script>
export default {
    created: function() {
        const loadedToken = localStorage.getItem('token')
        if (loadedToken) {
            this.$store.state.token = loadedToken
            this.token = loadedToken
        } else {
            this.$router.push('/')
        }
    },
    methods: {
        navigateToHome() {
            this.$router.push({path: '/'})
        },
    },
}
</script>