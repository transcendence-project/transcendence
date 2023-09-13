<template>
	<div id="home">
	  <TopNavBar />
	  <div class="side-cont">
		<SideNavBar />
		<router-view />
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import TopNavBar from "/app/src/components/TopNavBar.vue";
  import SideNavBar from "app/src/components/SideNavBar.vue";
  
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
  