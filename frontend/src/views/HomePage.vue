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
            <StatusUser :isFriend="true" class="mt-12" />
          </div>
          <div v-else>
            <StatusUser :isFriend="false" class="mt-12" />
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
            <div>Draws</div>
            <div>{{ draw }}</div>
          </div>
          <div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>Rank</div>
            <div>{{ rank }}</div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-[#ae445a] to-[#451952] shadow-third flex flex-col justify-center w-[45%] p-[10px] text-center rounded">
          <h3 class="text-xl">Achievments</h3>
          <div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>First Match</div>
            <div>{{ win }}</div>
          </div>
          <div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>First Win</div>
            <div>{{ lose }}</div>
          </div>
  
          <div class="shadow-third flex align-center justify-between mb-[5px] px-[50px] pb-[10px] pt-[5px] rounded">
            <div>Played 3 Matches</div>
            <div>{{ rank }}</div>
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

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import StatusUser from "@/components/StatusUser.vue";
import store from "@/store";

interface Match {
  date: string;
  opponent: string;
  result: string;
}

onMounted(() => {
  store.dispatch("fetchUserData");
});

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

const data = ref(null);
const fullname = computed(() => store.getters.getDisplayName);
const userimage = computed(() => {
  //   const backend = "http://localhost:3000";
  const image = store.getters.getImage;
  console.log(`the image is: ${image}`);
  return image;
});
// const userimage = computed(() => store.getters.getImage);

// const imgname = ref("head.svg");
// const imgname = computed(() => store.getters.getImage);
const win = computed(() => store.getters.getWin);
const lose = computed(() => store.getters.getLose);
const draw = computed(() => store.getters.getDraw);
const rank = computed(() => store.getters.getRank);
const avail = ref(true);



</script>
