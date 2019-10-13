<template>
    <div class="homePage">
        <h1>TaskTracker.io</h1>
        <div>
            <button class="btn" v-on:click.prevent="logout">Logout</button>
            <button class="btn" v-on:click.prevent="navToSettings">User Settings</button>
        </div>
        <hr/>
        <button class="btn autoWidth" v-on:click.prevent="navToNewTask()">Add New Task</button>
        <div id="filterLabelsAndSelects">
            <span id="filterLabels">
                <label class="smallText" for="filter">Filter by Task Status:</label>
                <label class="smallText" for="sortBy">Sort by:</label>
                <label class="smallText" for="order">Order:</label>
                <label class="smallText" for="limit">Results per page:</label>
            </span>
            <span class="spanGap"></span>
            <span>
                <div>
                    <select id="filter" v-model="selectedStatus">
                        <option v-for="criteria in statusOptions">
                            {{ criteria }}
                        </option>
                    </select>
                </div>
                <div>
                    <select id="sortBy" v-model="selectedSortBy">
                        <option v-for="criteria in sortByOptions">
                            {{ criteria }}
                        </option>
                    </select>
                </div>
                <div>
                    <select id="order" v-model="selectedOrder">
                        <option v-for="criteria in orderOptions">
                            {{ criteria }}
                        </option>
                    </select>
                </div>
                <div>
                    <select id="limit" v-model="selectedLimit">
                        <option v-for="criteria in limitOptions">
                            {{ criteria }}
                        </option>
                    </select>
                </div>
            </span>
        </div>
        <button class="btn" v-if="showNextButton" v-on:click.prevent="showNextPage">Next Page</button>
        <button class="btn" v-if="showPreviousButton" v-on:click.prevent="showPreviousPage">Previous Page</button>

        <ul id="tasks">
            <li v-for="(task, i) in taskArray">
                <div class="divGap"></div>
                <div class="taskDescAndStatus">
                    <span class="spanGap"></span>
                    <span class="justifyRight">
                        <p class="removePad">Description:</p>
                        <p class="removePad">Status:</p>
                    </span>
                    <span class="spanGap"></span>
                    <span>
                        <p class="removePad"><b>{{ task.description }}</b></p>
                        <p class="removePad"><b>{{ task.completedString }}</b></p>
                    </span>
                </div>
                <div class="justifyCenter">
                    <label v-if="task.showUpdateDescription" for="updateDescription">Updated Description:</label>
                    <input v-if="task.showUpdateDescription" type="text" id="updateDescription" v-model="task.description">
                    <button class="btn btn-small" v-if="!task.completed" v-on:click.prevent="changeCompletionStatus(task._id, true)">Mark as<br>Completed</button>
                    <button class="btn btn-small" v-if="task.completed" v-on:click.prevent="changeCompletionStatus(task._id, false)">Mark as<br>Incomplete</button>
                    <button class="btn btn-small" v-if="!task.showUpdateDescription" v-on:click.prevent="promptUpdateDescription(i)">Update<br>Description</button>
                    <button class="btn btn-small" v-if="!task.showUpdateDescription" v-on:click.prevent="deleteTask(task._id)">Delete<br>Task</button>
                    <button class="btn btn-small" v-if="task.showUpdateDescription" v-on:click.prevent="promptUpdateDescription(i)">Cancel Update<br>Description</button>
                    <button class="btn btn-small" v-if="task.showUpdateDescription" v-on:click.prevent="updateDescription(task._id, i)">Save</button>
                </div>
            </li>
        </ul>

    </div>
</template>

<script>
export default {
    data() {
        return {
            token:              "",
            taskArray:          [],
            selectedStatus:     'All Tasks',
            statusOptions:      ['All Tasks', 'Incomplete Only', 'Completed Only'],
            selectedSortBy:     'Last Created',
            sortByOptions:      ['Last Updated', 'Last Created'],
            selectedOrder:      'Descending Order',
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
        this.token = loadedToken
        this.getTasks()
    },
    methods: {
        deleteTask(taskID) {
            this.$http.delete(process.env.VUE_APP_API_URL + '/tasks/' + taskID, {
                headers:    {
                    Authorization:  'Bearer ' + this.token
                }
            }).then(response => {
                this.getTasks()
            }, error => {
                console.log(error)
            })
        },
        navToNewTask() {
            this.$router.push('/newtask')
        },
        navToSettings() {
            this.$router.push('/settings')
        },
        updateDescription(taskID, i) {
            this.$http.patch(process.env.VUE_APP_API_URL + '/tasks/' + taskID, {
                description:   this.taskArray[i].description,
            }, {
                headers: {
                    'Authorization':    'Bearer ' + this.token
                }
            }).then(response => {
                this.getTasks()
            }, error => {
                console.log(error)
            })
        },
        promptUpdateDescription(i) {
            this.taskArray[i].showUpdateDescription = !this.taskArray[i].showUpdateDescription
            this.$forceUpdate()
        },
        changeCompletionStatus(taskID, boolValue)  {
            this.$http.patch(process.env.VUE_APP_API_URL + '/tasks/' + taskID, {
                completed:  boolValue
            }, { 
                headers: { 
                    'Authorization':  'Bearer ' + this.token 
                } 
            }).then(response => {
                this.getTasks()
            }, error => {
                console.log(error)
            })
        },
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
            let url = process.env.VUE_APP_API_URL + '/tasks?'
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
            this.selectedLimit++
            url += 'limit=' + (this.selectedLimit).toString()
            this.selectedLimit--
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
                    task.showUpdateDescription = false
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
        },
        logout() {
            this.token = ''
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