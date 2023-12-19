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
  
			  <img
				:src="student.image"
				class="mx-2 rounded-full object-cover w-20 h-20"
			  />
			</div>
			<div v-if="avail">
			  <StatusUser :isFriend="true" class="mt-12" />
			</div>
			<div v-else>
			  <StatusUser :isFriend="false" class="mt-12" />
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
			<h3 class="text-xl">Achievments</h3>
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>First Match</div>
			  <div>{{ student.firstmatch }}</div>
			</div>
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>First Win</div>
			  <div>{{ student.firstwin }}</div>
			</div>
	
			<div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
			  <div>Played 3 Matches</div>
			  <div>{{ student.played3matches }}</div>
			</div>
		  </div>
		</div>
		<div
		  class="bg-gradient-to-r from-[#662549] to-[#451952] flex flex-col items-center justify-between p-[10px] mt-[10px] rounded"
		>
		  <h2>Match History</h2>
		  <ul class="history list-none p-0 w-[80%] text-center">
			<li
			  v-for="(matchItem, index) in match"
			  :key="index"
			  class="shadow-third bg-gradient-to-r from-[#662549] to-[#ae445a] p-[10px] m-[5px] rounded"
			>
			  {{ matchItem.date }} - Opponent: {{ matchItem.opponent }} - Result:
			  {{ matchItem.result }}
			</li>
		  </ul>
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


export default defineComponent({
	name: "StudentList",
	data() {
		return {
			student: [] as IStudent[],
			username: null,
		};
	},
	mounted() {
		this.username = store.state.username;
		const apiUrl = `http://localhost:3000/users/friend/${this.username}`;

		axios
			.get(apiUrl)
			.then((resp: AxiosResponse<IStudent[]>) => {
				this.student = resp.data;
			})
			.catch((error) => {
				console.error("Error fetching student data:", error);
			});
	},
});
</script>