<template>
  <nav
    class="bg-gradient-to-r from-[#662549] to-[#451952] shadow-custom flex justify-between items-center py-2.5 px-5 text-white"
  >
    <div class="text-2xl font-bold text-white hover:text-gray-500">
      <router-link to="/home">PING PONG</router-link>
    </div>
    <div class="flex items-center space-x-4">
      <div class="hidden sm:block">
        <!-- <div class="mr-5">{{ username }}</div> -->
        <div v-for="item in student" v-bind:key="item.id" class="std-list">
          {{ item.userName }}
        </div>
      </div>
      <DropdownMenu class="relative" />
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import axios, { AxiosResponse } from "axios";
import { defineComponent } from "vue";
import DropdownMenu from "./DropdownMenu.vue";
import { computed } from 'vue';
import store from '@/store';

const username = computed(() => { // computed -> to update automatically
      return store.getters.getUserName;
    });

interface Students {
  id: number;
  userName: string;
  email: string;
}
export default defineComponent({
//   name: "StudentList",
//   name: "DropdownMenu",
  components: {
    DropdownMenu,
  },
  data() {
    return {
      student: [] as Students[],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/users")
      .then((resp: AxiosResponse<Students[]>) => {
        this.student = resp.data;
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  },
});
</script>
<style scoped>
.top-nav-bar {
  background: #212327;
}
</style>
