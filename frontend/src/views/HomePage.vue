<template>
	<div
	  class="flex flex-col items-center bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded w-full h-full text-white"
	>
	  <div class="p-0 w-full m-0 text-center">
		<div class="flex content-center justify-between">
		  <div
			class="flex bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-seconed rounded p-10 w-[45%]"
		  >
			<div class="mr-4">
			  <!-- <img class="w-[100px] rounded-full" :src="require(`@/assets/${imgname}`)" /> -->
  
			  <img
				:src="userimage"
				class="mx-2 rounded-full object-cover w-20 h-20"
			  />
			</div>
			<div v-if="avail">
			  <StatusUser :isFriend="avail" class="mt-12" />
			</div>
			<div>
			  <p class="mt-[40px] ml-[20px]">{{ fullname }}</p>
			</div>
		  </div>
		  <div class="bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-third flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
			<h3>Player Stat</h3>
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>Wins</div>
			  <div>{{ win }}</div>
			</div>
			<div
			  class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded"
			>
			  <div>Loses</div>
			  <div>{{ lose }}</div>
			</div>
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>Rank</div>
			  <div>{{ rank }}</div>
			</div>
		  </div>
		  <div class="bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-third flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
			<h3 class="text-xl">Achievements</h3>
	    		<div v-for="achievement in achievements" :key="achievement.id" class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
	      			<div>{{ achievement.title }}</div>
	      		<div>🏆</div>
	    		</div>
		  </div>
		</div>
		<div
		  class="bg-gradient-to-r from-[#662549] to-[#451952] flex flex-col items-center justify-between p-[10px] mt-[10px] rounded"
		>
		  <h2>Match History</h2>
		<ul class="history list-none p-0 w-[80%] text-center">
	  	<li v-for="(matchItem, index) in match" :key="matchItem.id" class="shadow-third ...">
	    	Winner: {{ matchItem.playerOne.userName }} - Score: {{ matchItem.winnerScore }} <br>
	    	Loser: {{ matchItem.playerTwo?.userName }} - Score: {{ matchItem.loserScore }}
	  	</li>
		</ul>
		</div>
	  </div>
	</div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, computed, getCurrentInstance } from "vue";
  import StatusUser from "@/components/StatusUser.vue";
  import axios from "axios";
  import store from "@/store";
  import { useWebSocket } from "@/plugins/websocket-plugin";
  const { socket } = useWebSocket();

onMounted(async () => {
	const instance = getCurrentInstance();
	const accessToken = localStorage.getItem("token");
    socket.socket?.on('multi-login', () => {
		console.log("this is from the multi-login");
        instance?.proxy?.$toast.add({
			severity: "error",
			summary: "Cannot Connect to Game",
			detail: `User already logged in another session.`,
			life: 3000,
        });
    });
	socket.socket?.on('game-over', (data: string) => {
		store.dispatch("fetchUserData");
		store.dispatch("fetchMatches");
		store.dispatch("fetchAchievements");
	});

	if (accessToken) {
		store.dispatch("fetchUserData");
  		store.dispatch("fetchMatches");
  		store.dispatch("fetchAchievements");
		
		 const response = await axios.get(process.env.VUE_APP_BACKEND_URL + "/users/check-is-first-login", {
		  headers: {
			  		Authorization: `Bearer ${localStorage.getItem("token")}`,
			  	},
			  });
			  if (response.data.isFirstLogin) {
				  	if (instance && instance.proxy?.$toast) {
					  		instance.proxy.$toast.add({ severity: 'info', summary: 'Update Profile', detail: 'Be sure to update your profile!', life: 5000 });
			}
		}
	}
  });
  
  const data = ref(null);
  const fullname = computed(() => store.getters.getDisplayName);
  const userimage = computed(() => {
	const image = store.getters.getImage;
	console.log(`the image is: ${image}`);
	return image;
  });
  
  const win = computed(() => store.getters.getWin);
  const lose = computed(() => store.getters.getLose);
  const draw = computed(() => store.getters.getDraw);
  const rank = computed(() => store.getters.getRank);
  const match = computed(() => store.getters.getMatches);
  const achievements = computed(() => store.getters.getAchievements || []);
  const avail = ref("online");
  
  </script>
  