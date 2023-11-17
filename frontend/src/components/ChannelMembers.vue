<template>
<div class="src-chn flex flex-col">
    <div class="lst-cont py-5">
      <div class="h-[40vh] overflow-y-auto overflow-x-hidden">
        <ul class="w-[65%] p-5 flex-grow max-w-full">
          <!-- <div v-for="(friend, index) in userList" :key="index"> -->
          <div v-for="(friend, index) in searchMember" :key="index">
            <li class="list-none w-full mb-1">

              <div
                class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-1 p-1 w-full rounded-[10px] usr-item"
              >

                <!-- <div class="mx-0 px-3">{{ friend }}</div> -->
                <div  v-if="friend.owner === true" class="mx-0 px-3">{{ friend.user }}
					<span class="text-sm text-red-700"> owner</span>

				</div>
                <div  v-else-if="friend.admins === true" class="mx-0 px-3">{{ friend.user }}
					<span class="text-sm text-green-700"> admin</span>

				</div>
                <div  v-else class="mx-0 px-3">{{ friend.user }}
					<span class="text-sm text-yellow-700"> member</span>

				</div>

				<div class="relative">
					<button class="optbtn px-1" @click="showSelectedMember(index)">Options</button>

                  </div>
                <!-- <button class="intbtn p-1">Invite</button> -->
              </div>
			

				  <div v-if="selectedMemberIndex === index" class="my-2 opt">
				  	<div v-if="friend.owner === true">
					<button class="intbtn p-2 mx- 2" >Invite</button>
			
					</div>
				  <div v-else-if="friend.admins === true">
					<button class="intbtn p-2 mx- 2" >Invite</button>
					<button class="intbtn p-2 mx-2" >Kick</button>
			
				</div>
				  <div v-else>
					<button class="intbtn p-2 mx- 2" >Invite</button>
					<button class="intbtn p-2 mx-2" >Kick</button>
					<button class="intbtn p-2 mx-2" >Make Admin</button>		
				</div>

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
  owner: boolean;
  admins: boolean;
  status: Boolean;
}

const mem_list = ref([] as string[]);

export default defineComponent({
  data() {
    return {
		userList: mem_list,
		src_friend: "" as string,
		selectedMemberIndex: null,

      friends: [
        {
          user: "testvalue",
		  owner: true,
		  admins: true,
          status: true,
        },
        {
          user: "one",
		  owner: false,
		  admins: true,
          status: false,
        },
        {
          user: "two",
		  owner: false,
		  admins: true,
          status: true,
        },
        {
          user: "nine",
		  owner: false,
		  admins: false,
          status: false,
        },
        {
          user: "eleven",
		  owner: false,
		  admins: false,
          status: true,
        },
        {
          user: "urtyu",
		  owner: false,
		  admins: true,
          status: false,
        },
        {
          user: "gsdfgdsa",
		  owner: false,
		  admins: true,
          status: false,
        },
        {
          user: "uet",
		  owner: false,
		  admins: false,
          status: true,
        },
        {
          user: "tweleve",
		  owner: false,
		  admins: true,
          status: true,
        },

      ] as FriendsList[],
      searchQuery: "" as string,
      selectedChannel: null as string | null,
    };
  },
  setup() {
	const mem = async () => {
		await store.dispatch("fetchCurrentChan");
		const chan = computed(() => store.getters.getCurrentCahnnel);
		const val = chan.value.members;
		console.log(val);
		mem_list.value = [];
		val.forEach((item: any) => {
			mem_list.value.push(item.userName);
		  });
		  console.log(mem_list);
	};
	mem();
  },
  computed: {
    searchMember(): FriendsList[] {
      return this.friends.filter((item) =>
        item.user.toLowerCase().includes(this.src_friend.toLowerCase())
      );
    },

    // searchFriends(): string[] {
    //   return this.userList;
	//  .filter((item: string) =>
	//   item
        // item.user.toLowerCase().includes(this.searchQuery.toLowerCase())
    //   );
    // },
  },
  methods: {
    closePage(): void {
      this.$emit("close");
    },
    selectChannel(channel: string) {
      this.selectedChannel = channel;
    },
	showSelectedMember(index: any) {
		if (this.selectedMemberIndex === index)
		{
			this.selectedMemberIndex = null;
		}
		else
		{
			this.selectedMemberIndex = index;

		}
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
  background: black;

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
.optbtn,
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
.optbtn:hover,
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
