import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.css'
import WebSocketPlugin from '@/plugins/websocket-plugin';

createApp(App).use(store).use(router).use(WebSocketPlugin).mount('#app')
