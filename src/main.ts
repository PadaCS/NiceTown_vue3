import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//@ts-ignore
import { createPersistedState } from 'pinia-persistedstate-plugin'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const persist = createPersistedState()
const pinia = createPinia()
pinia.use(persist)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus)

app.use(pinia)
app.use(router)

app.mount('#app')


