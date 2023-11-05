<template>
	<div id="home">
	  <TopNavBar v-if="!isLoginPage"/>
	  <div class="side-cont">
		<SideNavBar  v-if="!isLoginPage"/>
		<router-view v-slot="{ Component }">
		  <Transition name="slide" mode="out-in">
			<component :is="Component" :key="$route.path"></component>
		  </Transition>
		</router-view>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useRouter } from "vue-router";
  import TopNavBar from "@/components/TopNavBar.vue";
  import SideNavBar from "@/components/SideNavBar.vue";
  
  export default defineComponent({
	name: "App",
	components: {
	  TopNavBar,
	  SideNavBar,
	},
	// computed: {
	// 	isLoginPage(): boolean{
	// 		return this.$store.getters.getReady;
	// 	},
	// }
	setup() {
	  const router = useRouter();
  
	  const isLoginPage = computed(() => {
		return router.currentRoute.value.name === "login";
	  });
  
	  return { isLoginPage };
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
  
  .slide-enter-active{
	transition: all 0.3s ease-out;
  }
  .slide-leave-active {
	transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .nav{
	width: 100%;
  }
  .slide-enter-from,
  .slide-leave-to {
	opacity: 0;
	transform: translateX(20px);
  }
  </style>
  