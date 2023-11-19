<template>
  <div class="flex flex-col items-center bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded w-full h-full text-white">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import store from '@/store';

await store.dispatch("TwoFA")

// onMounted(async () => {
// });
console.log(localStorage.getItem("qr"));
const qrcode = ref(localStorage.getItem("qr"));
console.log(qrcode.value);

// set the code sent by the user in the localStorage
// store.dispatch("ValidateTwoFA"); 

</script>

