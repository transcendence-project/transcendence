// websocket-plugin.ts
import { App, Plugin } from 'vue';
import { connectWebSocket, getSocket } from '@/socket/gameServices';

const WebSocketPlugin: Plugin = {
  install(app: App) {
    // Connect to WebSocket when the app is mounted
    app.mixin({
      mounted() {
        connectWebSocket('http://localhost:3000/game');
      },
    });

    // Add $socket property to the app's configuration
    app.config.globalProperties.$socket = getSocket();
  },
};

export default WebSocketPlugin;
