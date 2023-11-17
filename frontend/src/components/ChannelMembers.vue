<template>
<div class="src-chn flex flex-col">
    <div class="lst-cont py-5">
      <div class="h-[65%] overflow-y-auto overflow-x-hidden">
        <ul class="w-[65%] p-5 flex-grow max-w-full">
          <div v-for="(friend, index) in userList" :key="index">
            <li class="list-none w-full mb-1">
              <div
                class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-1 p-1 w-full rounded-[10px] usr-item"
              >
                <div class="mx-0 px-3">{{ friend }}</div>
                <button class="intbtn p-1">Invite</button>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <div class="cls-bt mb-5">
      <button class="clsbtn" @click="closePage">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import store from "@/store";

interface FriendsList {
  user: string;
  status: Boolean;
}

const mem_list = ref([] as string[]);

export default defineComponent({
  data() {
    return {
		userList: mem_list,
      searchQuery: "" as string,
      selectedChannel: null as string | null,
    };
  },
  setup() {
	  const mem = async () => {
		  await store.dispatch("fetchCurrentChan");
		  const chan = computed(() => store.getters.getCurrentCahnnel);
		  const val = chan.value.members;
		  // console.log(val);
		  mem_list.value = [];
		  val.forEach((item: any) => {
			  mem_list.value.push(item.userName);
			});
		  //   console.log(mem_list);
	  };
	  mem();
  },
  created(){
	store.state.chat.socket.on("update_mem_list", (data: any) => {
		console.log("helllloooooo");
		if (data)
		{
			if (data.user != store.getters.getUserName && localStorage.getItem("currentChanName") == data.chan_name){
				console.log(data);
				this.userList.push(data.user);
			}
		}
	});
  },
  beforeDestroy() {
	console.log("comes here--------");
	// store.state.chat.socket.off("update_mem_list");
},
computed: {
	searchFriends(): string[] {
		return this.userList;
		//  .filter((item: string) =>
		//   item
        // item.user.toLowerCase().includes(this.searchQuery.toLowerCase())
		//   );
    },
},
methods: {
	closePage(): void {
		this.$emit("close");
		store.state.chat.socket.off("update_mem_list");
    },
    selectChannel(channel: string) {
      this.selectedChannel = channel;
    },
	// async showUserList() {
    //   this.userList = [];
    //   await store.dispatch("fetchCurrentChan");
    //   const chan = computed(() => store.getters.getCurrentCahnnel);
    //   const val = chan.value.members;
    //   console.log(val);
    //   val.forEach((item: any) => {
    //     this.userList.push(item.userName);
    //   });
    // //   await this.displayMessage();
    // },
    // getUserList(channel: string): /* string[] */ {
    //   const selectedChannel = this.channels.find(
    //     (item: any) => item.channel === channel
    //   );
    //   return selectedChannel ? selectedChannel.user : [];
    // },
  },

});
</script>
<style scoped>
.src-chn {
  position: absolute;
  top: 30%;
  width: 40%;
  height: 50%;
  border-radius: 2%;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.lst-cont {
  width: 90%;
  height: 90%;
  color: white;
  border-radius: 2%;
  /* padding-left: 20%; */
}

.intbtn {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}

.clsbtn {
  font-size: 0.8rem;
  margin: 3%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}
.intbtn:hover,
.clsbtn:hover {
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
