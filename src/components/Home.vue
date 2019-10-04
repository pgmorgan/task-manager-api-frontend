<template>
    <div id="homePage">
        <h1>TaskTracker.io</h1>
        <div id="loginAndSignupBtnDiv">
            <button class="btn" v-if="!showLogin" v-on:click="promptLogin()">Login</button>
            <button class="btn" v-if="showLogin" v-on:click.prevent="promptLogin()">Cancel Login</button>
            <button class="btn" v-if="!showSignup" v-on:click="promptSignup()">Sign Up</button>
            <button class="btn" v-if="showSignup" v-on:click.prevent="promptSignup()">Cancel Sign Up</button>
        </div>
        <div v-if="showSignup" id="loginForm">
            <label for="signupName">User Name</label>
            <input type="text" id="signupName" v-model="signupName">
            <label for="signupEmail">Email</label>
            <input type="text" id="signupEmail" v-model="signupEmail">
            <label for="signupPassword">Password</label>
            <input type="password" id="signupPassword" v-model="signupPassword" v-on:keyup="checkPasswordMatch">
            <label for="signupConfirmPassword">Confirm Password</label>
            <input type="password" id="signupConfirmPassword" v-model="signupConfirmPassword" v-on:keyup="checkPasswordMatch" v-on:keyup.enter="signupSubmit()">
            <p v-if="emailError">Email address format is invalid</p>
            <p v-if="passwordError">Password length must be at least 8 characters</p>
            <p v-if="passwordMatchError">Passwords do not match</p>
            <button class="btn" v-on:click.prevent="signupSubmit">Sign Up</button>
        </div>        
        <div v-if="showLogin" id="loginForm">
            <label for="loginEmail">Email</label>
            <input type="text" id="loginEmail" v-model="loginEmail">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" v-model="loginPassword" v-on:keyup.enter="loginSubmit()">
            <p v-if="loginError">Email or Password are incorrect</p>
            <button class="btn" v-on:click.prevent="loginSubmit">Login</button>
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
            passwordMatchError: true,
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
        return
    },
    methods:    {
        checkPasswordMatch() {
            this.passwordMatchError = (this.signupPassword !== this.signupConfirmPassword)
        },
        promptSignup() {
            this.showSignup = !this.showSignup
            this.showLogin = false
        },
        promptLogin() {
            this.showLogin = !this.showLogin
            this.showSignup = false
        },
        signupSubmit() {
            if (this.passwordMatchError === true) {
                return
            }
            this.$http.post('http://localhost:3001/users', {
                name:       this.signupName,
                email:      this.signupEmail,
                password:   this.signupPassword,
            }).then(response => {
                this.$store.state.token = response.body.token
                localStorage.setItem('token', response.body.token)
                this.token = response.body.token
                /* ^^^^^^ */
                /* DELETE */
                this.$router.push('/loggedin')
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
                this.$router.push('/loggedin')
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
    .homePage{          
        display:            flex;
        flex-flow:          column nowrap;            
        align-items:        center;
    }

    #loginForm {
        display:            flex;
        flex-flow:          column nowrap;
    }

    hr {
        border:             0;
        clear:              both;
        display:            block;
        width:              96%;               
        background-color:   black;
        height:             1px;
        margin:             1rem 0 1rem 0;
        padding:            0;
    }

    .btn {
        font-weight:        bold;
        width:              14rem;
        padding:            0.7rem 0 0.7rem 0; 
        margin:             1rem;
        background-color:   lightblue;
    }

    .btn-small {
        width:              auto;
        font-size:          1.35rem;
        font-weight:        normal;
        padding:            0.3rem 0.3rem 0.3rem 0.3rem;
    }

    input {
        padding:            1rem;
        border:             1px solid rgb(140,140,140);
        border-radius:      0.3rem;
    }

    label {
        padding:            0.6rem 0 0 0.3rem;
    }

    p {
        padding:            0.3rem 0 0 0;
    }

    #loginAndSignupBtnDiv {
        display:            flex;
        flex-flow:          row wrap;
        justify-content:    center;
    }

    select {
        font-weight:        bold;
    }

</style>