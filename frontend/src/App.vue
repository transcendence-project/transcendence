<template>
	<div id="home">
	  <TopNavBar/>
	  <div class="side-cont">
          <SideNavBar v-if="!['login', 'game'].includes($route.name)"/>
		<router-view />
	  </div>
	</div>
</template>
  
<script lang="ts" setup>
  import { defineComponent } from "vue";
  import TopNavBar from "@/components/TopNavBar.vue";
  import SideNavBar from "@/components/SideNavBar.vue";

</script>
<!-- <script lang="ts" setup>
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TopNavBar from '@/components/TopNavBar.vue';
import SideNavBar from '@/components/SideNavBar.vue';
const isGamePage = ref(false);
const route = useRoute();
// Watch for route changes
watch(
  () => route.name,
  (newRouteName : any) => {
    isGamePage.value = newRouteName === 'game';
    // Update the CSS variable based on the route
    if (isGamePage.value) {
      document.documentElement.style.setProperty('--custom-background-color', '#AE445A');
    }
  }
);
// Optional: You can also change the background gradient on component mount
onMounted(() => {
  isGamePage.value = route.name === 'game';
});
</script> -->
<style scoped>
  body {
	font-family: "Arial", sans-serif;
	margin: 0;
	padding: 0;
  }
  .side-cont {
	display: flex;
  }
  .prof-cont {
	flex: 1;
	padding: 20px;
  }
</style>
  