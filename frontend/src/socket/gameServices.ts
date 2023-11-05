import { ref, Ref  } from 'vue';
import { io, Socket } from 'socket.io-client';

// const socket = ref<Socket | null>(null);
const socket: Ref<Socket | null> = ref(null);

export const connectWebSocket = (url: string, authToken: string): void => {
    const _token = localStorage.getItem('token');
    const headers = {
      withCredentials: true,
      extraHeaders: _token ? { token:  _token} : undefined,
    };
  
  socket.value = io(url,headers);
};

export const getSocket = (): Socket | null => {
  return socket.value;
};
