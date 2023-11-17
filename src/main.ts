import './assets/styles/base.scss'
import 'virtual:svg-icons-register'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import { Lazyload } from 'vant'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { TUIComponents, TUICore, genTestUserSig } from './TUIKit'
import { TUICallKit } from '@tencentcloud/call-uikit-vue'

const SDKAppID = 1600009914 // Your SDKAppID

const TUIKit = TUICore.init({
  SDKAppID
})

TUIKit.use(TUIComponents)
TUIKit.use(TUICallKit)

const app = createApp(App)

app.use(Lazyload)
app.use(createPinia())
app.use(router)
app.use(TUIKit)
app.mount('#app')
