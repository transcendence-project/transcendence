<template>
    <div class="flex flex-col items-center bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-8 rounded w-full h-full text-white">
        <div class="text-sm	mb-5">
            The Winner is
        </div>
        <div class="text-lg mb-5">{{ winner }}</div>
        <!-- <div></div> -->
        <ButtonComponent btnContent="Ok" @click="goToHome" />
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import ButtonComponent from './ButtonComponent.vue';
const props = defineProps({
    winner: {
        type: String as () => string | null,
        default: null
    }
});
const router = useRouter();

// Function to navigate to home
function goToHome() {
    router.push('/home');
}
</script>