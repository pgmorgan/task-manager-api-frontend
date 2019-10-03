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
            <div>
                <label for="limit">Number of results per page:</label>
                <select id="limit" v-model="selectedLimit">
                    <option v-for="criteria in limitOptions">
                        {{ criteria }}
                    </option>
                </select>
            </div>
            <button v-if="showNextButton" v-on:click.prevent="showNextPage">Next Page</button>
            <button v-if="showPreviousButton" v-on:click.prevent="showPreviousPage">Previous Page</button>
        </span>

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
            selectedLimit:      10,
            limitOptions:       [5, 10, 20, 50],
            skipAmount:         0,
            showNextButton:     false,
        }
    },
    created () {
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
        // console.log(this.taskArray.length, this.selectedLimit)
        // if (this.taskArray.length > this.selectedLimit) {
        //     this.showNextButton = true
        // }
    },
    methods: {
        showPreviousPage() {
            this.skipAmount -= this.selectedLimit
            this.getTasks()
            this.showNextButton = true
            if (this.skipAmount === 0) {
                this.showPreviousButton = false
            }
        },
        showNextPage() {
            this.skipAmount += this.selectedLimit
            this.getTasks()
            this.showPreviousButton = true
        },
        modifyTaskUrl() {
            let url = 'http://localhost:3001/tasks?'
            if (this.selectedStatus === 'Incomplete Only') {
                url += 'completed=false&'
            } else if (this.selectedStatus === 'Completed Only') {
                url += 'completed=true&'
            }
            if (this.selectedSortBy === 'Last Updated') {
                url += 'sortBy=updatedAt'
            } else if (this.selectedSortBy === 'Last Created') {
                url += 'sortBy=createdAt'
            }
            if (this.selectedOrder === 'Ascending Order') {
                url += '_asc&'
            } else if (this.selectedOrder === 'Descending Order') {
                url += '_desc&'
            }
            url += 'limit=' + (this.selectedLimit + 1).toString()
            url += '&skip=' + this.skipAmount.toString()
            return url
        },
        getTasks() {
            const url = this.modifyTaskUrl()
            this.$http.get(url, { headers: { 'Authorization':  'Bearer ' + this.token } })
            .then(response => {
                this.taskArray.length = 0
                this.taskArray = response.body
                this.taskArray.forEach(function(task) {
                    if (task.completed === true) {
                        task.completedString = 'Completed'
                    } else {
                        task.completedString = 'Incomplete'
                    }
                })
                console.log(response.body)
                if (this.taskArray.length > this.selectedLimit) {
                    this.showNextButton = true
                    this.taskArray.pop()
                } else {
                    this.showNextButton = false
                }
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
    watch: {
        selectedStatus: function() {
            this.taskArray.length = 0
            this.getTasks()
        },
        selectedSortBy: function() {
            this.taskArray.length = 0
            this.getTasks()
        },
        selectedOrder:  function() {
            this.taskArray.length = 0
            this.getTasks()
        },
        selectedLimit:  function() {
            this.taskArray.length = 0
            this.getTasks()
        },
    },
}
</script>