<template>
  <div class="friend">
    <h2 class="fnd-head">{{ filteredSearch.length }} friends</h2>
    <div class="frd-srch">
      <input v-model="text" placeholder="Search friend" class="search-frd" />
    </div>
    <ul class="ul-cont">
      <div v-for="(result, index) in filteredSearch" :key="index">
        <li class="li-cont">
          <div class="frd-list">
            <h4 class="h-cont">
              <img
                class="srch-img"
                :src="require(`@/assets/${result.imgname}`)"
              />
              {{ result.user }}
              <div class="status">
                <div v-if="result.friend">
                  <div class="frd-usr-avail"></div>
                </div>
                <div v-if="!result.friend">
                  <div class="frd-usr-not-avail"></div>
                </div>
              </div>
            </h4>
            <div>
              <button class="addbtn">Add</button>
              <button class="blkbtn">Block</button>
            </div>
          </div>
        </li>
      </div>
    </ul>
    <ul class="frnd-cont">
      <div v-for="(result, index) in filteredSearch" :key="index">
        <li class="li-cont">
          <div class="frd-list">
            <div class="status">
              <h4 class="h-cont">
                <img
                  class="srch-img"
                  :src="require(`@/assets/${result.imgname}`)"
                />
                {{ result.user }}
              </h4>
              <div v-if="result.friend">
                <div class="frd-usr-avail"></div>
              </div>
              <div v-if="!result.friend">
                <div class="frd-usr-not-avail"></div>
              </div>
            </div>
            <OptionMenu />
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionMenu from "@/components/OptionMenu.vue";

interface SearchItem {
  user: string;
  imgname: string;
  friend: boolean;
}

export default defineComponent({
  name: "TopNavBar",
  components: {
    OptionMenu,
  },
  data() {
    return {
      search: [
        {
          user: "Player A",
          imgname: "head.svg",
          friend: true,
        },
        {
          user: "Player B",
          imgname: "chat.svg",
          friend: false,
        },
        {
          user: "five one",
          imgname: "head.svg",
          friend: true,
        },
        {
          user: "size numer",
          imgname: "chat.svg",
          friend: false,
        },
      ] as SearchItem[],
      text: "" as string,
      activeDropdowns: null as number | null,
    };
  },
  computed: {
    filteredSearch(): SearchItem[] {
      return this.search.filter((item) =>
        item.user.toLowerCase().includes(this.text.toLowerCase())
      );
    },
  },
});
</script>

<style scoped>
.friend {
	background: linear-gradient(to right, #451952, #451952, #ae4188);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);  
  margin: 20px;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  color: white;
}

.search-frd {
  width: 60%;
  height: 2rem;
  border: none;
  border-radius: 20px;
  padding-left: 15px;
}
.search-frd:focus {
  border: none;
  outline: none;
}
.frd-srch {
  display: flex;
  padding-left: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  margin: 0;
  margin-bottom: 5px;
  background: #AE445A;
}

.frd-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #AE445A;
  /* background: #34373d; */
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 10px;
  padding-left: 10px;
}
.ul-cont {
  margin: 0;
  padding: 0;
  border-radius: 10px;
}
.frnd-cont {
  margin-top: 20px;
  padding: 0;
  border-radius: 10px;
}

.li-cont {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.h-cont {
  padding-left: 30px;
  margin: 10px;
  border-radius: 10px;
}
.srch-img {
  width: 30px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  margin-right: 10px;
}

.addbtn,
.blkbtn {
  font-size: 0.8rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  /* background: #697692; */
  border: none;
}
.addbtn:hover,
.blkbtn:hover {
  background: #7c8392;
  color: #d9d9da;
}
/* .usr-avail {
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
} */
.opt-menu {
  padding-right: 20px;
}
.opt-menu img {
  width: 35px;
}
.main-container {
  display: flex;
}
.top-navbar {
  display: flex;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px;
}

.nav-item {
  margin: 0 10px;
  cursor: pointer;
}

.nav-item:hover {
  text-decoration: underline;
}
.dropdowns {
  position: relative;
}

.dropdowns a {
  cursor: pointer;
}

.dropdowns-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
}

.dropdowns.active .dropdowns-menu {
  display: block;
}

.dropdowns-menu li {
  padding: 8px 16px;
  border-top: 1px solid #ccc;
}

.dropdowns-menu li a {
  text-decoration: none;
  color: #333;
  display: block;
}

.dropdowns-menu li a:hover {
  background-color: #f2f2f2;
}
.status {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.h-cont {
  display: flex;
  align-items: center;
  justify-content: center;
}
.frd-usr-avail {
  display: flex;
  width: 0.6rem;
  height: 0.6rem;
  /* margin-top: 1rem; */
  margin-left: 0.3rem;
  border-radius: 50%;
  border-style: groove;
  background: green;
}
.frd-usr-not-avail {
  display: flex;
  width: 0.6rem;
  height: 0.6rem;
  /* margin-top: 1rem; */
  margin-left: 0.3rem;
  border-radius: 50%;
  border-style: groove;
  background: rgb(231, 8, 8);
}

@media screen and (max-width: 768px) {
  .frd-srch {
    padding-left: 20px;
  }
  .h-cont {
    padding-left: 10px;
  }
  .srch-img {
    width: 20px;
  }
  .frd-list{
	flex-direction: column;
	align-items: flex-start;
  }

  .addbtn,
  .blkbtn {
    font-size: 0.7rem;
    padding-left: 1rem;
    padding-right: 1rem;
	margin-left: .2rem;
	margin-top: 10px;
  }
  .frd-usr-avail,
  .frd-usr-not-avail {
    width: 0.5rem;
    height: 0.5rem;
    /* margin-top: 1rem; */
    margin-left: 0.2rem;
  }
}
</style>
