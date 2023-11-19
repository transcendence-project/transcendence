import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.css'
import WebSocketPlugin from '@/plugins/websocket-plugin';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(WebSocketPlugin);
app.mount("#app");
// createApp(App).use(store).use(router).use(WebSocketPlugin).mount('#app')
