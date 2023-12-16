<template>
	<div class="std">
		<h2 class="text-lg">Student List</h2>
		<div class="std-stat">
			<div class="std-title text-white my-2">
				<div class="tit-list">Full Name</div>
				<div class="tit-list">User Name</div>
				<div class="tit-list">Image</div>
				<div class="tit-list">Email</div>
				<div class="tit-list">Points</div>
			</div>

			<div v-for="item in student" v-bind:key="item.id" class="std-list">
				<div class="lst-item">{{ item.id }}</div>
				<div class="lst-item">{{ item.fullname }}</div>
				<div class="lst-item">{{ item.userName }}</div>
				<div class="lst-item">
					<img :src="item.image" class=" m-1 w-[5vh] rounded-full" />

					</div>
				<div class="lst-item">{{ item.email }}</div>
				<div class="lst-item">{{ item.points }}</div>
				<div class="lst-item">{{ item.wins }}</div>
				<div class="lst-item">{{ item.loses }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent } from "vue";
import axios, { AxiosResponse } from "axios";
import { IStudent } from "@/models/student";


export default defineComponent({
	name: "StudentList",
	data() {
		return {
			student: [] as IStudent[],
		};
	},
	mounted() {
		axios
			.get("http://localhost:3000/users")
			.then((resp: AxiosResponse<IStudent[]>) => {
				this.student = resp.data;
			})
			.catch((error) => {
				console.error("Error fetching student data:", error);
			});
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
	display: inline;
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
