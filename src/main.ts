import './assets/styles/base.scss'
import 'virtual:svg-icons-register'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import { Lazyload } from 'vant'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Lazyload)
app.use(createPinia())
app.use(router)
app.mount('#app')
