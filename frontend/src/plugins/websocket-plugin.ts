// // websocket-plugin.ts
// import { App, Plugin } from 'vue';
// import { connectWebSocket, getSocket } from '@/socket/gameServices';

// const WebSocketPlugin: Plugin = {
//   install(app: App) {
//     // Connect to WebSocket when the app is mounted
//     app.mixin({
//       mounted() {
//         connectWebSocket('http://localhost:3000/game');
//       },
//     });

//     // Add $socket property to the app's configuration
//     app.config.globalProperties.$socket = getSocket();
//   },
// };

// export default WebSocketPlugin;

// websocket-plugin.ts
import { App} from 'vue';
import { io, Socket } from 'socket.io-client';

export default {
  install(app: App) {
            const _token = localStorage.getItem('token');
            console.log('Token:', _token);
            const headers = {
                extraHeaders: _token ? { token:  _token} : undefined,
            };
  
            const socket = io('http://localhost:3000/game', headers);
        app.config.globalProperties.$socket = socket;
  },
};

// export default WebSocketPlugin;
