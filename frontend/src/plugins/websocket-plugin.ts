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
// import { App} from 'vue';
// import { io, Socket } from 'socket.io-client';

// export default {
//   install(app: App) {
//             const _token = localStorage.getItem('token');
//             console.log('Token:', _token);
//             const headers = {
//                 extraHeaders: _token ? { token:  _token} : undefined,
//             };

//             const socket = io('http://localhost:3000/game', headers);
//         app.config.globalProperties.$socket = socket;
//   },
// };

// import { App, reactive } from 'vue';
// import { io, Socket } from 'socket.io-client';

// const socketState = reactive({
//   socket: null as Socket | null,
// });

// export default {
//   install(app: App) {
//     app.config.globalProperties.$connectSocket = () => {
//       const _token = localStorage.getItem('token');
//       if (_token && !socketState.socket) {
//         console.log('Token:', _token);
//         const headers = {
//           extraHeaders: { token: _token },
//         };
//         socketState.socket = io('http://localhost:3000/game', headers);
//       }
//     };

//     app.config.globalProperties.$disconnectSocket = () => {
//       if (socketState.socket) {
//         socketState.socket.disconnect();
//         socketState.socket = null;
//       }
//     };

//     app.config.globalProperties.$socket = socketState;
//   },
// };

import { App, reactive } from "vue";
import { io, Socket } from "socket.io-client";

export const socketState = reactive({
  socket: null as Socket | null,
});
export function useWebSocket() {
  return {
    connectSocket: () => {
      const _token = localStorage.getItem("token");
      if (_token && !socketState.socket) {
        const headers = {
          extraHeaders: { token: _token },
        };
        socketState.socket = io(process.env.VUE_APP_BACKEND_URL + "/game", headers);
      }
    },
    disconnectSocket: () => {
      if (socketState.socket) {
        socketState.socket.disconnect();
        socketState.socket = null;
      }
    },
    socket: socketState,
  };
}

export default {
  install(app: App) {
    const ws = useWebSocket();
    app.config.globalProperties.$connectSocket = ws.connectSocket;
    app.config.globalProperties.$disconnectSocket = ws.disconnectSocket;
    app.config.globalProperties.$socket = ws.socket;
  },
};
