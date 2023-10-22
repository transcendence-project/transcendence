<template>
  <div class="lead">
    <h2>Leader Board</h2>
    <div class="lead-stat">
      <ul>
        <div class="title">
          <h3>Rank</h3>
          <h3>User</h3>
          <h3>Total Matches</h3>
          <h3>Wins</h3>
          <h3>Loses</h3>
          <h3>Draws</h3>
        </div>
        <div v-for="(match, index) in match" :key="index" class="li-cont">
          <li class="li-cls">
            <div class="list">
              <h4 class="lst">{{ match.rank }}</h4>
              <h4>
                <img
                  class="usr-img"
                  :src="require(`@/assets/${match.imgname}`)"
                />
                {{ match.user }}
              </h4>
              <h4>{{ match.matches }}</h4>
              <h4>{{ match.wins }}</h4>
              <h4>{{ match.loses }}</h4>
              <h4>{{ match.draws }}</h4>
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

<style scoped>
.lead {
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

.lead-stat {
  padding: 0;
  width: 100%;
  margin: 0;
  text-align: center;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #AE445A;
  margin-bottom: 5px;
  width: 98%;
  margin-bottom: 5px;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 5px;
}
.list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #AE445A;
  /* background: #34373d; */
  width: 98%;
  margin-bottom: 5px;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 5px;
}
.li-cls {
  list-style-type: none;
}

.usr-img {
  width: 30px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
}
.lst {
  padding: 0;
  margin: 0;
}
@media screen and (max-width: 768px) {
  .title,
  .list {
    flex-direction: column;
  }
}
</style>
