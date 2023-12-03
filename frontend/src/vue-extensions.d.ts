import { Socket } from 'socket.io-client';
import { Reactive  } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // $socket: any;
    $socket: Reactive<{ socket: Socket | null }>;
  }
}
