import Home from './components/Home.vue'
import LoggedIn from './components/LoggedIn.vue'

export const routes = [
    { path: '',             component: Home },
    { path: '/loggedin',    component: LoggedIn},
]