import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/global.css";
import WebSocketPlugin from "@/plugins/websocket-plugin";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import "primevue/resources/themes/saga-blue/theme.css"; // theme
import "primevue/resources/primevue.min.css"; // core css
import "primeicons/primeicons.css";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faPersonRunning)

const app = createApp(App);


app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(WebSocketPlugin);
app.mount("#app");
// createApp(App).use(store).use(router).use(WebSocketPlugin).mount('#app')
