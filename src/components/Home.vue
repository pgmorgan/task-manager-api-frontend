<template>
    <div>
        <h1>The Home Page</h1>
        <hr>
        <button v-if="!showSignup" v-on:click="promptSignup()">Sign Up</button>
        <button v-if="showSignup" v-on:click.prevent="promptSignup()">Cancel Sign Up</button>
        <button v-if="!showLogin" v-on:click="promptLogin()">Login</button>
        <button v-if="showLogin" v-on:click.prevent="promptLogin()">Cancel Login</button>
        <div v-if="showSignup" id="loginForm">
            <label for="signupName">User Name</label>
            <input type="text" id="signupName" v-model="signupName">
            <label for="signupEmail">Email</label>
            <input type="text" id="signupEmail" v-model="signupEmail">
            <label for="signupPassword">Password</label>
            <input type="password" id="signupPassword" v-model="signupPassword">
            <label for="signupConfirmPassword">Confirm Password</label>
            <input type="password" id="signupConfirmPassword" v-model="signupConfirmPassword" v-on:keyup.enter="signupSubmit()">
            <p v-if="emailError">Email address format is invalid</p>
            <p v-if="passwordError">Password length must be at least 8 characters</p>
            <p v-if="passwordMatchError">Passwords do not match</p>
            <button v-on:click.prevent="signupSubmit">Sign Up</button>
        </div>        
        <div v-if="showLogin" id="loginForm">
            <label for="loginEmail">Email</label>
            <input type="text" id="loginEmail" v-model="loginEmail">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" v-model="loginPassword" v-on:keyup.enter="loginSubmit()">
            <p v-if="loginError">Email or Password are incorrect</p>
            <button v-on:click.prevent="loginSubmit">Login</button>
        </div>        
        <p>{{ token }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            signupName:         "",
            signupEmail:        "",
            signupPassword:     "",
            signupConfirmPassword:  "",
            showSignup:         false,
            showLogin:          false,
            emailError:         false,
            passwordError:      false,
            passwordMatchError: false,
            token:              "",
        }
    },
    created:    function() {
        const loadedToken = localStorage.getItem('token')
        if (loadedToken) {
            this.$store.state.token = loadedToken
            this.token = loadedToken
            /* ^^^^^^ */
            /* DELETE */
            this.$router.push('/loggedin')
        }
    },
    methods:    {
        promptSignup() {
            this.showSignup = !this.showSignup
            this.showLogin = false
        },
        promptLogin() {
            this.showLogin = !this.showLogin
            this.showSignup = false
        },
        signupSubmit() {
            if (this.signupPassword !== this.signupConfirmPassword) {
                this.passwordMatchError = true
                return
            } else {
                this.passwordMatchError = false
            }
            this.$http.post('http://localhost:3001/users', {
                name:       this.signupName,
                email:      this.signupEmail,
                password:   this.signupPassword,
            }).then(response => {
                this.$store.state.token = response.body.token
                localStorage.setItem('token', response.body.token)
                this.token = response.body.token
            }, error => {
                console.log(error)
                if (error.body.errors.email) {
                    if (error.body.errors.email.message === 'Email is invalid') {
                        this.emailError = true
                    }
                } else {
                    this.emailError = false
                }
                if (error.body.errors.password) {
                    if (error.body.errors.password.kind === 'minlength') {
                        this.passwordError = true
                    }
                } else {
                    this.emailError = false
                }
            })
        },
        loginSubmit() {
            this.$http.post('http://localhost:3001/users/login', {
                email:      this.loginEmail,
                password:   this.loginPassword,
            }).then(response => {
                this.loginError = false
                /* ^^^^^^ */
                /* DELETE */
                this.$store.state.token = response.body.token
                localStorage.setItem('token', response.body.token)
                this.token = response.body.token
                /* ^^^^^^ */
                /* DELETE */
            }, error => {
                if (error.body.status === 400) {
                    this.loginError = true
                }
                console.log(error)
            })
        },
    },
}
</script>

<style>
    #loginForm {
        display:        flex;
        flex-flow:      column nowrap;
    }
</style>