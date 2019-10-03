import Home from './components/Home.vue'
import LoggedIn from './components/LoggedIn.vue'
import Settings from './components/Settings.vue'

export const routes = [
    { path: '',             component: Home },
    { path: '/loggedin',    component: LoggedIn},
    { path: '/settings',    component: Settings},
]