<template>
  <div class="flex flex-col items-center bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded w-full h-full text-white">
    <div class="p-0 w-full m-0 text-center">
      <div class="flex content-center justify-between">
        <div class="flex bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-cust rounded p-10 w-[45%]">
          <div class="mr-4">
            <img class="w-[100px] rounded-full" :src="require(`@/assets/${imgname}`)" />
          </div>
          <div v-if="avail">
            <StatusUser :isFriend="true" class="mt-12"/>
          </div>
          <div v-else>
            <StatusUser :isFriend="false" class="mt-12"/>
          </div>
          <div>
            <p class="mt-[40px] ml-[20px]">{{ fullname }}</p>
          </div>
        </div>
        <div class="right flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
          <h3>Player Stat</h3>
          <div class="stat flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>Wins</div>
            <div>{{ win }}</div>
          </div>
          <div class="stat flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>Loses</div>
            <div>{{ lose }}</div>
          </div>
          <div class="stat flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>Draws</div>
            <div>{{ draw }}</div>
          </div>
          <div class="stat flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>Rank</div>
            <div>{{ rank }}</div>
          </div>
        </div>
      </div>
      <div class="bottom flex flex-col items-center justify-between p-[10px] mt-[10px] rounded">
        <h2>Match History</h2>
        <ul class="history list-none p-0 w-[80%] text-center">
          <li v-for="(matchItem, index) in match" :key="index" class="bg-gradient-to-r from-[#662549] to-[#ae445a] p-[10px] m-[5px] rounded">
            {{ matchItem.date }} - Opponent: {{ matchItem.opponent }} - Result:
            {{ matchItem.result }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import StatusUser from "@/components/StatusUser.vue";
interface Match {
  date: string;
  opponent: string;
  result: string;
}

const match = ref<Match[]>([
  { date: "2023-08-15", opponent: "Player A", result: "Win" },
  { date: "2023-08-10", opponent: "Player B", result: "Loss" },
  { date: "2023-08-05", opponent: "Player C", result: "Draw" },
  { date: "2023-08-15", opponent: "Player A", result: "Win" },
  { date: "2023-08-10", opponent: "Player B", result: "Loss" },
  { date: "2023-08-05", opponent: "Player C", result: "Draw" },
  { date: "2023-08-15", opponent: "Player A", result: "Win" },
  { date: "2023-08-10", opponent: "Player B", result: "Loss" },
  { date: "2023-08-05", opponent: "Player C", result: "Draw" },
]);

const fullname = ref("Yonas Yohannes");
const imgname = ref("head.svg");
const win = ref(65);
const lose = ref(5);
const draw = ref(9);
const rank = ref(3);
const avail = ref(true);

</script>

<style scoped>
.shadow-cust {
  box-shadow: 4px 2px 0 rgba(0, 0, 0, 0.5);
}
.right {
  background: linear-gradient(to right, #ae445a, #451952);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.stat {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.bottom {
  background: linear-gradient(to right, #662549, #451952);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.history {

}
.history li {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
