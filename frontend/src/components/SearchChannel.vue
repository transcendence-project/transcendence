<template>
  <div class="src-chn">
    <div class="flex justify-center m-0 mt-2 p-0 w-full h-[350px]">
      <ul class="w-[100%] p-1 m-1">
        <div v-for="(result, index) in filteredSearch" :key="index">
          <li class="list-none w-full m-2">
            <div
              class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-1 p-2 w-full rounded-[10px]"
            >
              {{ result.channel }}
              {{ result.group }}
			  <div class="chn-btm">
				<button class="jbtn">Join</button>
			  </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from "vue";

interface ChannelList {
  channel: string;
  group: string;
  user: string[];
  friend: boolean;
}

export default defineComponent({
  data() {
    return {
      channels: [
        {
          channel: "fruits",
          group: "private",
          user: ["orange", "banana", "apple", "lemon", "peach"],
          friend: false,
        },
        {
          channel: "computer",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
        },
        {
          channel: "laptop",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
        },
        {
          channel: "systems",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
        },
        {
          channel: "techonogy",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
        },
        {
          channel: "robotic",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
        },
        {
          channel: "furniture",
          group: "public",
          user: ["door", "chair", "bed", "table", "tv", "gate"],
          friend: false,
        },
        {
          channel: "cars",
          group: "public",
          user: ["mercedes", "volvo", "BMW", "Ferrari"],
          friend: true,
        },
        {
          channel: "plants",
          group: "public",
          user: ["tree", "grass", "bush", "leaf"],
          friend: true,
        },
        {
          channel: "mamamls",
          group: "public",
          user: [
            "dog",
            "cat",
            "cow",
            "lion",
            "tiger",
            "elephant",
            "fish",
            "donkey",
          ],
          friend: false,
        },
        {
          channel: "domestci",
          group: "public",
          user: [
            "dog",
            "cat",
            "cow",
            "lion",
            "tiger",
            "elephant",
            "fish",
            "donkey",
          ],
          friend: false,
        },
        {
          channel: "species",
          group: "public",
          user: [
            "dog",
            "cat",
            "cow",
            "lion",
            "tiger",
            "elephant",
            "fish",
            "donkey",
          ],
          friend: false,
        },
      ] as ChannelList[],
	  searchQuery: "" as string,
    };
  },
  computed: {
    filteredSearch(): ChannelList[] {
      return this.channels.filter(
        (item) =>
          item.channel.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          item.group === "private"
      );
    },
  },

});
</script>
<style scoped>
.src-chn {
  position: fixed;

  width: 40%;
  height: 40%;
  padding: 10%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.jbtn {
  font-size: .8rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}

.jbtn:hover {
  background: #ae4488;
  color: #d9d9da;
}


@media screen and (max-width: 768px) {
  .channel {
    width: 90%;
    height: 50%;
    padding: 5%;
  }
}


</style>
