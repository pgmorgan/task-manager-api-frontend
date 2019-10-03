<template>
    <div>
        <h1>The Logged In Page</h1>
        <hr>
        <p>{{ token }}</p>
        <span>
            <div>
                <label for="filter">Filter by Task Status:</label>
                <select id="filter" v-model="selectedStatus">
                    <option v-for="criteria in statusOptions">
                        {{ criteria }}
                    </option>
                </select>
            </div>
            <div>
                <label for="sortBy">Sort by:</label>
                <select id="sortBy" v-model="selectedSortBy">
                    <option v-for="criteria in sortByOptions">
                        {{ criteria }}
                    </option>
                </select>
            </div>
            <div>
                <label for="order">Order:</label>
                <select id="order" v-model="selectedOrder">
                    <option v-for="criteria in orderOptions">
                        {{ criteria }}
                    </option>
                </select>
            </div>
        </span>
        <p>{{ selectedStatus }}</p>
        <ul>
            <li v-for="task in taskArray">
                <p>Description: {{ task.description }}</p>
                <p>Status: {{ task.completedString }}</p>
            </li>
        </ul>
        <button v-on:click.prevent="logout">Logout</button>

    </div>
</template>

<script>
export default {
    data() {
        return {
            token:          "",
            taskArray:      [],
            selectedStatus:     'All Tasks',
            statusOptions:      ['All Tasks', 'Incomplete Only', 'Completed Only'],
            selectedSortBy:     'Last Updated',
            sortByOptions:      ['Last Updated', 'Last Created'],
            selectedOrder:      'Ascending Order',
            orderOptions:       ['Ascending Order', 'Descending Order'],
        }
    },
    created() {
        const loadedToken = localStorage.getItem('token')
        if (!loadedToken) {
            this.$router.push('/')
            return
        }
        this.$store.state.token = loadedToken
        this.token = loadedToken
        // /* ^^^ DELETE ^^^^ */
        // /* ^^^^^^^^^^^^^^^ */
        
        this.getTasks()
    },
    methods: {
        getTasks() {
            let url = 'http://localhost:3001/tasks'
            // let headers = new Headers({'Content-Type': 'application/json;charset=utf-8'})
            // headers.append('authorization', 'Bearer ' + this.token)
            // this.taskArray.push(JSON.parse(this.$http.get(url, {
            this.$http.get(url, { headers: { 'Authorization':  'Bearer ' + this.token } })
            .then(response => {
                this.taskArray = response.body
                this.taskArray.forEach(function(task) {
                    if (task.completed === true) {
                        task.completedString = 'Completed'
                    } else {
                        task.completedString = 'Incomplete'
                    }
                })
                console.log(response.body)
            }, error => {
                console.log(error)
            })
            // console.log(this.taskArray)
        },
        logout() {
            this.$store.state.token = ''
            localStorage.setItem('token', '')
            this.$router.push({path: '/'})
        },
    },
}
</script>