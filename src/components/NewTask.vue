<template>
    <div class="homePage">
        <h1>TaskTracker.io</h1>
        <div>
            <button class="btn" v-on:click.prevent="logout">Logout</button>
            <button class="btn" v-on:click.prevent="navToSettings">User Settings</button>
        </div>
        <hr>
        <label for="taskDescription">Task Description:</label>
        <input type="text" id="taskDescription" v-model="taskDescription">
        <div>
            <label for="status">Status:</label>
            <select id="status" v-model="taskStatus">
                <option v-for="(status, i) in statusArray">
                    {{ status }}
                </option>
            </select>
        </div>
        <button class="btn" v-on:click.prevent="addTask()">Add Task</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            token:              '',
            taskDescription:    '',
            taskStatus:         'Incomplete',
            statusArray:        ['Incomplete', 'Completed'],
            taskStatusBool:     false,
        }
    },
    created() {
        const loadedToken = localStorage.getItem('token')
        if (!loadedToken) {
            this.$router.push('/')
            return
        }
        // this.$store.state.token = loadedToken
        this.token = loadedToken      
    },
    methods: {
        addTask() {
            if (this.taskDescription === '') {
                return
            }
            this.taskStatusBool = (this.taskStatus === 'Incomplete') ? false : true
            this.$http.post(process.env.VUE_APP_API_URL + '/tasks', {
                description:    this.taskDescription,
                completed:      this.taskStatusBool,
            }, {
                headers: {
                    Authorization:  'Bearer ' + this.token,
                }
            }).then(response => {
                console.log(response.body)
                this.$router.push('/loggedin')
            }, error => {
                console.log(error)
            })
        },
        logout() {
            this.token = ''
            // this.$store.state.token = ''
            localStorage.setItem('token', '')
            this.$router.push({path: '/'})
        },
        navToSettings() {
            this.$router.push('/settings')
        },
    },
    watch: {
    },
}
</script>

<style>
</style>