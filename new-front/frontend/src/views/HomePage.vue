<template>
  <div class="prof-com">
    <div class="prof-div">
      <div class="up">
        <div class="left">
          <div class="left-prof">
            <img class="prof-img" :src="require(`@/assets/${imgname}`)" />
          </div>
          <div v-if="avail">
            <div class="usr-avail"></div>
          </div>
          <div v-if="!avail">
            <div class="usr-not-avail"></div>
          </div>
          <div class="left-usr">
            <p class="usrname">{{ fullname }}</p>
          </div>
        </div>
        <div class="right">
          <h3>Player Stat</h3>
          <div class="stat">
            <div class="s-left">Wins</div>
            <div class="s-right">{{ win }}</div>
          </div>
          <div class="stat">
            <div class="s-left">Loses</div>
            <div class="s-right">{{ lose }}</div>
          </div>
          <div class="stat">
            <div class="s-left">Draws</div>
            <div class="s-right">{{ draw }}</div>
          </div>
          <div class="stat">
            <div class="s-left">Rank</div>
            <div class="s-right">{{ rank }}</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <h2>Match History</h2>
        <ul class="history">
          <li v-for="(match, index) in match" :key="index">
            {{ match.date }} - Opponent: {{ match.opponent }} - Result:
            {{ match.result }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ProfilePage",
  data() {
    return {
      match: [
        { date: "2023-08-15", opponent: "Player A", result: "Win" },
        { date: "2023-08-10", opponent: "Player B", result: "Loss" },
        { date: "2023-08-05", opponent: "Player C", result: "Draw" },
        { date: "2023-08-15", opponent: "Player A", result: "Win" },
        { date: "2023-08-10", opponent: "Player B", result: "Loss" },
        { date: "2023-08-05", opponent: "Player C", result: "Draw" },
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
};
</script>

<style scoped>
.prof-com {
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
.prof-div {
  padding: 0;
  width: 100%;
  margin: 0;
  text-align: center;
}
.up {
  display: flex;
  align-content: center;
  justify-content: space-between;
}
.left {
  display: flex;
  background: linear-gradient(to right, #ae445a, #451952);
  box-shadow: 4px 2px 0 rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 10px;
  width: 45%;
}
.usr-avail {
  width: 1rem;
  height: 1rem;
  margin-top: 3rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  border-style: groove;
  background: green;
}
.usr-not-avail {
  width: 1rem;
  height: 1rem;
  margin-top: 3rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  border-style: groove;
  background: rgb(231, 8, 8);
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(to right, #ae445a, #451952);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  width: 45%;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}
.stat {
  display: flex;
  align-items: center;
  background: #ae445a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  justify-content: space-between;
  margin-bottom: 5px;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 10px;
  padding-top: 5px;
  border-radius: 5px;
}
.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #662549, #451952);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  margin-top: 10px;
  border-radius: 5px;
  padding: 10px;
}
.history {
  list-style-type: none;
  padding: 0;
  width: 80%;
  text-align: center;
}
.history li {
  background: linear-gradient(to right, #662549, #ae445a);

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}
.prof-img {
  width: 100px;
  border-radius: 50%;
}
.usrname {
  margin-top: 45px;
  margin-left: 20px;
}

@media screen and (max-width: 768px) {
  .up {
    flex-direction: column;
    align-items: center;
  }
  .left,
  .right {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
