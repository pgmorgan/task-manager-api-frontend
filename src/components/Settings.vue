<template>
    <div>
        <h1>Settings</h1>
        <hr>
            <button v-on:click.prevent="logoutAll()">Logout from All Browsers</button>
            <p>This will log you out from all sessions on any device.</p>
        <hr>
        <p>Name: {{ oldName }}<br>
        Email: {{ oldEmail }}<br>
        Age: {{ oldAge }}</p>
        <p>Update one or multiple user profile details.</p>
        <div class="col">
            <label for="newName">User Name (Optional)</label>
            <input type="text" id="newName" v-model="newName">
            <label for="newEmail">Email (Optional)</label>
            <input type="text" id="newEmail" v-model="newEmail">
            <label for="newPassword">Password (Optional)</label>
            <input type="text" id="newPassword" v-model="newPassword" v-on:keyup="checkPasswordError()">
            <label for="newConfirmPassword">Confirm Password (Optional)</label>
            <input type="text" id="newConfirmPassword" v-model="newConfirmPassword" v-on:keyup="checkPasswordError()">
            <p v-if="passwordMatchError">Passwords do not match</p>
            <p v-if="passwordLengthError">Passwords length must be at least 8 characters</p>
            <label for="newAge">Age (Optional)</label>
            <div>
                <select id="newAge" v-model="newAge">
                    <option v-for="age in 120">
                        {{ age }}
                    </option>
                </select>
            </div>
        </div>
        <button v-on:click.prevent="updateUser()">Update</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            oldName:                "",
            oldEmail:               "",
            oldAge:                 null,
            newName:                "",
            newEmail:               "",
            newAge:                 null,
            newPassword:            "",
            newConfirmPassword:     "",
            passwordMatchError:     false,
            passwordLengthError:    false,
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
        this.getUserDetails()
    },
    methods: {
        logoutAll() {
            this.$http.post('http://localhost:3001/users/logoutAll', {}, {
                headers:    {
                    Authorization:  'Bearer ' + this.token
                }
            }).then(response => {
                this.$store.state.token = ''
                localStorage.setItem('token', '')
                this.token = ''
                this.$router.push('/')
            }, error => {
                console.log(error)
            })
        },
        getUserDetails() {
            this.$http.get('http://localhost:3001/users/me', {
                headers:    {
                    Authorization:  'Bearer ' + this.token
                }
            }).then(response => {
                this.oldName = response.body.name
                this.newName = response.body.name
                this.oldEmail = response.body.email
                this.newEmail = response.body.email
                this.oldAge = response.body.age
                this.newAge = response.body.age
            }, error => {
                console.log(error)
            })
        },
        checkPasswordLength() {
            if (this.newPassword.length < 8) {
                this.passwordLengthError = true
            } else {
                this.passwordLengthError = false
            }
        },
        checkPasswordMatch() {
            if (this.newPassword !== this.newConfirmPassword) {
                this.passwordMatchError = true
            } else {
                this.passwordMatchError = false
            }
        },
        checkPasswordError() {
            this.checkPasswordMatch()
            this.checkPasswordLength()
        },
        updateUser() {
            let updateObj = {}
            if (this.newName !== this.oldName) {
                updateObj.name = this.newName
            }
            if (this.newEmail !== this.oldEmail) {
                updateObj.email = this.newEmail
            }
            if (this.newAge !== this.oldAge) {
                updateObj.age = this.newAge
            }
            if (this.newPassword !== "" 
                && this.newPassword === this.newConfirmPassword
                && this.newPassword.length > 7) {
                updateObj.password = this.newPassword
            }
            this.$http.patch('http://localhost:3001/users/me', updateObj, {
                headers:    {
                    Authorization:  'Bearer ' + this.token
                }
            }).then(response => {
                this.getUserDetails()
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
    .col {
        display:    flex;
        flex-flow:  column nowrap;
    }
</style>