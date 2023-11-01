<template>
	<div id="home">
	  <TopNavBar v-if="!['login'].includes($route.name)"/>
	  <div class="side-cont">
          <SideNavBar v-if="!['login'].includes($route.name)"/>
		<router-view />
	  </div>
	</div>
</template>
  
<script lang="ts">
  import { defineComponent } from "vue";
  import TopNavBar from "@/components/TopNavBar.vue";
  import SideNavBar from "@/components/SideNavBar.vue";
  
  export default defineComponent({
	name: "homePage",
	components: {
	  TopNavBar,
	  SideNavBar,
	},
  });
</script>
  
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
  