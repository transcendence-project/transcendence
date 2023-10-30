import { ref, Ref  } from 'vue';
import { io, Socket } from 'socket.io-client';

// const socket = ref<Socket | null>(null);
const socket: Ref<Socket | null> = ref(null);

export const connectWebSocket = (url: string, authToken: string): void => {
  socket.value = io(url, {
    withCredentials: true,
    extraHeaders: {
        // message: 'this is from the client-side',
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const getSocket = (): Socket | null => {
  return socket.value;
};
