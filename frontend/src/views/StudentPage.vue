<template>
  <div class="std">
    <h2>Student List</h2>
    <div class="std-stat">
      <div class="std-title">
        <div class="tit-list">Id</div>
        <div class="tit-list">First</div>
        <div class="tit-list">Last</div>
        <div class="tit-list">Email</div>
        <div class="tit-list">Status</div>
        <div class="tit-list">Win</div>
        <div class="tit-list">Lose</div>
        <div class="tit-list">Draw</div>
        <div class="tit-list">Rank</div>
      </div>

      <div v-for="item in student" v-bind:key="item.id" class="std-list">
        <div class="lst-item">{{ item.id }}</div>
        <div class="lst-item">{{ item.first_name }}</div>
        <div class="lst-item">{{ item.last_name }}</div>
        <div class="lst-item">{{ item.email }}</div>
        <div class="lst-item">{{ item.status }}</div>
        <div class="lst-item">{{ item.win }}</div>
        <div class="lst-item">{{ item.lose }}</div>
        <div class="lst-item">{{ item.draw }}</div>
        <div class="lst-item">{{ item.rank }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios, { AxiosResponse } from "axios";
import { defineComponent } from "vue";
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
  font-size: 1.5rem;
  color: black;
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
}
</style>
