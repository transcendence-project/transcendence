<template>
    <button class="text-xs px-6 py-2 rounded-md ml-2 cursor-pointer text-white bg-[#451952] border-0 hover:bg-[#aa3dcb] hover:text-[#d9d9da]">
        {{ btnContent }}
    </button>
</template>



<script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    btnContent: string;
  }>();
  
</script>