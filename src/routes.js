import Home from './components/Home.vue'
import LoggedIn from './components/LoggedIn.vue'
import Settings from './components/Settings.vue'
import DeleteAccount from './components/DeleteAccount.vue'
import NewTask from './components/NewTask.vue'

export const routes = [
    { path: '',             component: Home },
    { path: '/loggedin',    component: LoggedIn},
    { path: '/settings',    component: Settings},
    { path: '/deleteaccount', component: DeleteAccount},
    { path: '/newtask',     component: NewTask},
]