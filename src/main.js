import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import { routes } from './routes'
import { store } from './store/store'

/*  Using vue-router to manage "page" routing on the Single Page Application */
Vue.use(VueRouter)
/*  Using vue-resource to make http requests to the backend REST API */
Vue.use(VueResource)
Vue.use(VueCookies)

VueCookies.config('2h')

const router = new VueRouter({
  routes: routes,
  mode:   'history',
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),
})
