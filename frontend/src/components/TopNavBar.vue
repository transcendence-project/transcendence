<template>
  <nav class="bg-gradient-to-r from-[#662549] to-[#451952] shadow-custom flex justify-between items-center py-2.5 px-5 text-white">
    <div class="text-2xl font-bold text-white hover:text-gray-500">
      <router-link to="/home">PING PONG</router-link>
    </div>
    <div class="flex items-center space-x-4">
      <div class="hidden sm:block">
        <div class="mr-5">{{ username }}</div>
      </div>
      <DropdownMenu class="relative" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import DropdownMenu from "./DropdownMenu.vue";
const username = "yoyohann";
</script>

<style scoped>
.top-nav-bar {
  background: #212327;
}
</style>