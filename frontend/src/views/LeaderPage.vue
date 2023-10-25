<template>
  <div class="bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded w-full h-full text-white min-h-[85.4vh] md:min-h-[85.10vh] lg:min-h-[85.9vh]">
    <h2 class="text-center font-bold text-lg my-5">Leader Board</h2>
    <div class="p-2 w-full m-0 text-center">
      <ul>
        <div class="flex md:flex-row items-center justify-between bg-[#ae445a] mb-5 w-98 p-2 md:px-40 py-3 rounded text-center">
          <h3 class="ml-1 text-[14px] md:text-lg">Rank</h3>
          <h3 class="ml-1 text-[14px] md:text-lg">User</h3>
          <h3 class="ml-1 text-[14px] md:text-lg">Matches</h3>
          <h3 class="ml-1 text-[14px] md:text-lg">Wins</h3>
          <h3 class="ml-1 text-[14px] md:text-lg">Loses</h3>
          <h3 class="text-[14px] md:text-lg">Draws</h3>
        </div>
        <div v-for="(match, index) in match" :key="index" class="li-cont">
          <li class="list-none">
            <div class="flex items-center justify-between bg-[#ae445a] w-98 mb-5 px-6 md:px-40 rounded">
              <h4 class="md:pl-4">{{ match.rank }}</h4> 
              <h4>
                <img
                  class="w-[25px] md:w-[30px] rounded-full p-0 my-1 ml-2"
                  :src="require(`@/assets/${match.imgname}`)"
                />
                {{ match.user }}
              </h4>
              <h4 class="pr-2 md:pr-4">
                {{ match.matches }}
              </h4>
              <h4 class="pr-2 md:pr-4">{{ match.wins }}</h4>
              <h4 class="pr-4">{{ match.loses }}</h4>
              <h4 class="md:pr-4">{{ match.draws }}</h4>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Match {
  rank: number;
  user: string;
  imgname: string;
  matches: number;
  wins: number;
  loses: number;
  draws: number;
}

export default defineComponent({
  data() {
    return {
      match: [
        {
          rank: 3,
          user: "Player A",
          imgname: "head.svg",
          matches: 5,
          wins: 12,
          loses: 2,
          draws: 9,
        },
        {
          rank: 5,
          user: "Player A",
          imgname: "chat.svg",
          matches: 5,
          wins: 8,
          loses: 3,
          draws: 6,
        },
        {
          rank: 12,
          user: "Player A",
          imgname: "game.svg",
          matches: 9,
          wins: 3,
          loses: 7,
          draws: 7,
        },
      ] as Match[],
    };
  },
});
</script>

