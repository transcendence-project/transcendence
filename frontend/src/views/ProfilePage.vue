<template>
	<div class="bg-gray-900 p-5 rounded-lg md:w-3/4 lg:w-1/2 mx-auto">
	  <div class="flex flex-col md:flex-row items-center justify-between">
		<div class="md:flex">
		  <div class="md:w-1/3">
			<div class="flex items-center">
			  <img
				class="w-20 h-20 rounded-full mr-4"
				:src="require(`@/assets/${imgname}`)"
				alt="Profile Image"
			  />
			  <div>
				<p class="text-white text-xl">{{ fullname }}</p>
				<div
				  v-if="avail"
				  class="w-4 h-4 bg-green-500 rounded-full ml-2"
				></div>
				<div
				  v-if="!avail"
				  class="w-4 h-4 bg-red-500 rounded-full ml-2"
				></div>
			  </div>
			</div>
		  </div>
		  <div class="md:w-2/3 mt-4 md:mt-0 md:ml-4">
			<h3 class="text-white text-lg md:text-xl">Player Stats</h3>
			<div class="flex justify-between mt-2">
			  <div class="flex flex-col items-center">
				<div class="text-gray-300">Wins</div>
				<div class="text-white text-xl">{{ win }}</div>
			  </div>
			  <div class="flex flex-col items-center">
				<div class="text-gray-300">Losses</div>
				<div class="text-white text-xl">{{ lose }}</div>
			  </div>
			  <div class="flex flex-col items-center">
				<div class="text-gray-300">Draws</div>
				<div class="text-white text-xl">{{ draw }}</div>
			  </div>
			  <div class="flex flex-col items-center">
				<div class="text-gray-300">Rank</div>
				<div class="text-white text-xl">{{ rank }}</div>
			  </div>
			</div>
		  </div>
		</div>
		<div class="mt-4 md:mt-0">
		  <h2 class="text-white text-lg md:text-xl">Match History</h2>
		  <ul class="mt-2">
			<li
			  v-for="(match, index) in matches"
			  :key="index"
			  class="bg-gray-800 rounded-lg mb-2 p-2"
			>
			  {{ match.date }} - Opponent: {{ match.opponent }} - Result:
			  {{ match.result }}
			</li>
		  </ul>
		</div>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
	data() {
	  return {
		matches: [
		  { date: "2023-08-15", opponent: "Player A", result: "Win" },
		  { date: "2023-08-10", opponent: "Player B", result: "Loss" },
		  { date: "2023-08-05", opponent: "Player C", result: "Draw" },
		],
		fullname: "Yonas Yohannes",
		imgname: "head.svg",
		win: 65,
		lose: 5,
		draw: 9,
		rank: 3,
		avail: false,
	  };
	},
  });
  </script>
  
  <style scoped>
  </style>
  