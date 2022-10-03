import { createApp } from 'vue'
// 引入pinia进行数据管理
import {createPinia} from 'pinia'
// 引入UI框架
import naive from 'naive-ui'
// 引入路由
import router from './router'
// 引入特效
import Particles from "vue3-particles";
import { createDiscreteApi } from 'naive-ui'
import App from './App.vue'

// 把经常用的UI组件放在全局
const { message, notification, dialog, loadingBar } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar']
)
const serverUrl = 'http://localhost:8888'
const app = createApp(App)
app.provide('message',message)
app.provide('dialog',dialog)
app.provide('serverUrl',serverUrl)
app.use(Particles)
app.use(naive)
app.use(createPinia())
app.use(router)
app.mount('#app')
