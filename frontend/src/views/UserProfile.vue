<template>
	<div v-if="student"
	  class="flex flex-col items-center bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded w-full h-full text-white"
	>
	  <div class="p-0 w-full m-0 text-center">
		<div class="flex content-center justify-between">
		  <div
			class="flex bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-seconed rounded p-10 w-[45%]"
		  >
			<div class="mr-4">
  
			  <img
				:src="student.image"
				class="mx-2 rounded-full object-cover w-20 h-20"
			  />
			</div>
			<div v-if="avail">
			  <StatusUser :isFriend="avail" class="mt-12" />
			</div>
			<div v-else-if="avail">
			  <StatusUser :isFriend="avail" class="mt-12" />
			</div>
			<div>
			  <p class="mt-[40px] ml-[20px]">{{ student.fullname }}</p>
			</div>
		  </div>
		  <div class="bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-third flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
			<h3>Player Stat</h3>
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>Wins</div>
			  <div>{{ student.wins }}</div>
			</div>
			<div
			  class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded"
			>
			  <div>Loses</div>
			  <div>{{ student.loses }}</div>
			</div>
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>Rank</div>
			  <div>{{ student.points }}</div>
			</div>
		  </div>
		  <div class="bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-third flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
			<h3 class="text-xl">Achievements</h3>
	    <div v-for="achievement in student.achievements" :key="achievement.id" class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
	      <div>{{ achievement.title }}</div>
	      <div>🏆</div>
	    </div>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  


<script lang="ts">
import Vue from "vue";
import { defineComponent } from "vue";
import axios, { AxiosResponse } from "axios";
import { IStudent } from "@/models/student";
import store from "@/store";
import StatusUser from "@/components/StatusUser.vue";
import { useWebSocket } from "@/plugins/websocket-plugin";

const { socket } = useWebSocket();
export default defineComponent({
	name: "StudentList",
	data() {
		return {
			student: null as IStudent | null,
			username: "",
            avail: "", 
		};
	},
	components: {
        StatusUser,
	},
	watch: {
		'$route.params.username': {
			immediate: true,
			handler(NewUserName) {
				this.FetchUserProfile(NewUserName);
			}
		}
	},
	
	methods: {
		FetchUserProfile ( NewUserName: string ){

			const apiUrl = process.env.VUE_APP_BACKEND_URL + `/users/friend/${NewUserName}`;
	
			axios
				.get(apiUrl, {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				})
				.then((resp: AxiosResponse<IStudent>) => {
					this.student = resp.data;
					console.log("the student in view: ",this.student.achievements);
				})
				.catch((error) => {
					console.error("Error fetching student data:", error);
				});
		}
	},
	mounted() {
		this.FetchUserProfile(this.$route.params.username as string);
        this.username = this.$route.params.username as string;
        socket.socket?.emit('user-profile-status', this.username);
        socket.socket?.on('user-status', (status: string) => {
            console.log("this is the status ", status);
            if (status === 'online')
                this.avail = 'online';
            else if (status === 'ingame')
                this.avail = 'ingame'
            else
                this.avail = 'offline'
        });
	},
});
</script>