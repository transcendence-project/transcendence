<template>
    <div :class="statusClass"></div>
</template>
  
<script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    isFriend: boolean;
  }>();
  
  const statusClass = props.isFriend ? 'frd-usr-avail' : 'frd-usr-not-avail';
</script>
  
<style scoped>
  .frd-usr-avail, .frd-usr-not-avail {
    display: flex;
    width: 0.6rem;
    height: 0.6rem;
    margin-left: 0.3rem;
    border-radius: 50%;
    border-style: groove;
  }
  
  .frd-usr-avail {
    background: green;
  }
  
  .frd-usr-not-avail {
    background: rgb(231, 8, 8);
  }
</style>
  