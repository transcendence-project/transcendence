<template>
  <div class="bg-compBg m-5 p-5 rounded-md w-full text-white min-h-[85.4vh] md:min-h-[85.10vh] lg:min-h-[85.9vh]">
    <h2>{{ filteredSearch.length }} friends</h2>
    <div class="flex justify-center pl-0 pl-[50px] pt-2.5 pb-2.5 rounded-md m-0 mb-[5px] bg-sideNav">
      <input v-model="text" placeholder="Search friend" class="w-[60%] h-[2rem] rounded-full text-center focus:border-0 focus:outline-none text-black" />
    </div>
    <ul class="m-0 mt-4 p-0 rounded-md">
      <div v-for="(result, index) in filteredSearch" :key="index">
        <li class="list-none p-0 m-0">
          <div class="flex items-center justify-between bg-[#34373d] m-0 pt-3 md:pt-0 pb-3 md:pb-0 pr-6 pl-2 flex-col md:flex-row">
            <h4 class="pl-[30px] m-2.5 rounded-md flex flex-row">
              <img
                class="w-7 rounded-full p-0 m-0 mr-2"
                :src="require(`@/assets/${result.imgname}`)"
              />
              {{ result.user }}
              <div class="flex items-center justify-between">
                <div v-if="result.friend">
                  <StatusUser :isFriend="result.friend"/>
                </div>
                <div v-if="!result.friend">
                  <StatusUser :isFriend="result.friend"/>
                </div>
              </div>
            </h4>
            <div class="flex justify-between">
              <ButtonComponent btnContent="Add"/>
              <ButtonComponent btnContent="Block"/>
            </div>
          </div>
        </li>
      </div>
    </ul>
    <ul class="mt-5 p-0 rounded-md">
      <div v-for="(result, index) in filteredSearch" :key="index">
        <li class="list-none p-0 m-0">
          <div class="flex items-center justify-between bg-[#34373d] m-0 pt-3 md:pt-0 pb-3 md:pb-0 pr-2 pl-2">
            <div class="flex items-center justify-between">
              <h4 class="pl-[30px] m-2.5 rounded-md flex flex-row">
                <img
                  class="w-7 rounded-full p-0 m-0 mr-2.5"
                  :src="require(`@/assets/${result.imgname}`)"
                />
                {{ result.user }}
              </h4>
              <div v-if="result.friend">
                  <StatusUser :isFriend="result.friend"/>
                </div>
                <div v-if="!result.friend">
                  <StatusUser :isFriend="result.friend"/>
                </div>
            </div>
            <OptionMenu class="relative pr-5"/>
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionMenu from "@/components/OptionMenu.vue";
import StatusUser from "@/components/StatusUser.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";

interface SearchItem {
  user: string;
  imgname: string;
  friend: boolean;
}

export default defineComponent({
  name: "TopNavBar",
  components: {
    OptionMenu,
    StatusUser,
    ButtonComponent,
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
