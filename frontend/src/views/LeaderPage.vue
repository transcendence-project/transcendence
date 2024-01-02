<template>
	<div class="std">
	  <h2 class="text-lg">Leader Board</h2>
	  <div class="std-stat">
		<div class="std-list text-lg text-gray-200">
		  <div class="lst-item">User</div>
		  <div class="lst-item">Image
		  </div>
		  <div class="lst-item">Rank</div>
		  <div class="lst-item">Wins</div>
		  <div class="lst-item">Loses</div>
		  </div>
		<div v-for="item in student" :key="item.id" class="std-list">
		  <div class="lst-item">{{ item.fullname }}</div>
		  <div class="lst-item">
			<img :src="item.image" class=" w-[4vh] rounded-full" />
		  </div>
		  <div class="lst-item">{{ item.points }}</div>
		  <div class="lst-item">{{ item.wins }}</div>
		  <div class="lst-item">{{ item.loses }}</div>
		</div>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import Vue from "vue";
  import { defineComponent, onMounted } from "vue";
  import axios, { AxiosResponse } from "axios";
  import { IStudent } from "@/models/student";
  
  export default defineComponent({
	name: "StudentList",
	data() {
	  return {
		student: [] as IStudent[],
	  };
	},
	methods: {
	  async fetchLeaderboard() {
		try {
		  const response = await axios.get(process.env.VUE_APP_BACKEND_URL + "/users/leaderboard");
		  this.student = response.data;
		} catch (error) {
		  console.error("Error fetching student data:", error);
		}
	  },

	},
	async mounted() {
	  try {
		await this.fetchLeaderboard();
	  } catch (error) {
		console.error("Error in mounted:", error);
	  }
	},
  });
  </script>
  

<style scoped>
.std {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(to right, #451952, #451952, #ae4188);
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
	margin: 20px;
	padding: 20px;
	border-radius: 5px;
	width: 100%;
	height: 100%;
	color: white;
}

.std-stat {
	padding: 0;
	width: 100%;
	margin: 0;
	text-align: center;
}

.std-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #ae445a;
	margin-bottom: 5px;
	width: 98%;
	margin-bottom: 5px;
	padding-right: 10px;
	padding-left: 10px;
	border-radius: 5px;
}

.tit-list {
	display: inline;
	font-size: 1rem;
	/* color: black; */
	background: #ae445a;
	margin-bottom: 5px;
	width: 98%;
	margin-bottom: 5px;
	padding: 10px;
}

.std-list {
	display: flex;
	align-items: left;
	font-size: 1rem;
	justify-content: space-between;
	background: #ae445a;
	width: 98%;
	margin-bottom: 5px;
	padding-top: 0;
	padding-bottom: 0;
	padding-right: 10px;
	padding-left: 10px;
	border-radius: 5px;
}

.lst-item {
	display: inline-block;
	align-items: right;
	justify-content: right;
	padding-bottom: 10px;
	padding-top: 10px;
	width: 10%;
}

.usr-img {
	width: 30px;
	border-radius: 50%;
	padding: 0;
	margin: 0;
}

@media screen and (max-width: 768px) {

	.std-title,
	.std-list {
		flex-direction: column;
	}
}</style>
