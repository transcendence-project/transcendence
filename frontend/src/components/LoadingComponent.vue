<template>
    <div>
        Wait till the oppoent found
    </div>
    <semipolar-spinner
  :animation-duration="2000"
  :size="65"
  color="#ff1d5e"
/>
<button @click="leaveQueue">Back to home</button>
</template>


<script setup lang="ts">

import { defineEmits} from 'vue';
import { SemipolarSpinner , } from 'epic-spinners'

const emit = defineEmits(['leave-queue']);

const leaveQueue = () => {
  emit('leave-queue', true);
}
</script>