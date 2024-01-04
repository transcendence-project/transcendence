<template>
    <div :class="statusClass"></div>
</template>
  
<script setup lang="ts">
  import { defineProps, computed } from 'vue';
  
  const props = defineProps<{
    isFriend: string;
  }>();
  
//   const statusClass = props.isFriend ? 'frd-usr-avail' : 'frd-usr-not-avail';

const statusClass = computed(() => {
  switch (props.isFriend) {
    case 'online':
      return 'frd-usr-avail';
    case 'offline':
      return 'frd-usr-not-avail';
    case 'ingame':
      return 'frd-usr-ingame';
    default:
      return ''; // Default class or empty string if no match
  }
});

</script>
  
<style scoped>
  .frd-usr-avail, .frd-usr-not-avail,.frd-usr-ingame {
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
  .frd-usr-ingame {
    background: wheat;
  }
</style>
  