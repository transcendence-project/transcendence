<template>
    <div class="bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-third flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
    <h2 class="font-bold my-5">Select Your Game Type</h2>
    <div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
      <button @click="selectGameType('classic')" class="text-white font-light text-sm">Classic Game</button>
      <button @click="selectGameType('custom')" class="text-white font-light text-sm">Custom Game</button>
    </div>

    <div v-if="gameType" class="shadow-third flex-col align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
      <h2 class="font-bold my-2">Select Game Mode</h2>
      <div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
        <button @click="selectGameMode('single')" class="text-white font-light text-sm">Single Player</button>
        <button @click="selectGameMode('online')" class="text-white font-light text-sm">Online Multiplayer</button>
      </div>
    </div>

    <div v-if="gameMode" class="shadow-third flex-col align-center justify-start mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
      <h3 class="font-bold my-2">You selected: {{ gameMode }} Mode</h3>
      <h3 class="font-bold my-2">You selected: {{ gameType }} Game</h3>
          <button @click="sendToServer" class="text-white font-light text-sm" v-if="gameMode === 'single'">Play Game</button>
          <button @click="sendToServer" class="text-white font-light text-sm" v-if="gameMode === 'online'">Find Match</button>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, getCurrentInstance, computed, defineEmits} from 'vue';

    const gameType = ref('');
    const gameMode = ref('');
    const loading = ref(false)
    const instance = getCurrentInstance();
    // Define emit function
const emit = defineEmits(['updateGameMode', 'updateGameType']);

    const selectGameType = (type: string) => {
      gameType.value = type;
      gameMode.value = '';
    };

    const selectGameMode = (mode: string) => {
      gameMode.value = mode;
    };

    const isOnlineGame = computed(() => gameMode.value === 'online');

    const sendToServer = () => {
        loading.value = true
      if (instance?.proxy) 
      {
        const gameInfo = {
            gameType: gameType.value,
            gameMode: gameMode.value
        };
        emit('updateGameMode', gameMode.value === 'online');
        emit('updateGameType', gameType.value === 'custom');
        const socket = instance.proxy.$socket.socket;
        if (socket)
            socket.emit('info', gameInfo);
      } 
      else  
      {
          console.log("Socket is not connected or something is wrong in the component");
      }
    };
</script>


<style scoped>
.containrrr {
    display: flex;
}
</style>