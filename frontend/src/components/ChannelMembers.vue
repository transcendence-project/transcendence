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
                <div v-if="friend.owner === true" class="mx-0 px-3">
                  {{ friend.user }}
                  <span class="text-sm text-red-700"> owner</span>
                </div>
                <div v-else-if="friend.admins === true" class="mx-0 px-3">
                  {{ friend.user }}
                  <span class="text-sm text-green-700"> admin</span>
                </div>
                <div v-else class="mx-0 px-3">
                  {{ friend.user }}
                  <span class="text-sm text-yellow-700"> member</span>
                </div>

                <div class="relative">
                  <button
                    class="optbtn px-1"
                    @click="showSelectedMember(index)"
                  >
                    Options
                  </button>
                </div>
                <!-- <button class="intbtn p-1">Invite</button> -->
              </div>

              <div v-if="selectedMemberIndex === index" class="my-2 opt">
                <div v-if="friend.owner === true">
                  <button class="intbtn p-2 mx-2" @click="send_invite(friend.user)">Invite</button>
                </div>
                <div v-else-if="friend.admins === true">
                  <button class="intbtn p-2 mx-2">Invite</button>
                  <button
                    class="intbtn p-2 mx-2"
                    @click="mute_mem(friend.user)"
                  >
                    Mute
                  </button>
                  <button
                    class="intbtn p-2 mx-2"
                    @click="kick_mem(friend.user)"
                  >
                    Kick
                  </button>
                </div>
                <div v-else>
                  <button 
                  class="intbtn p-2 mx- 2"
                  @click="send_invite(friend.user)"
                  >
                  Invite
                </button>
                  <button
                    class="intbtn p-2 mx-2"
                    @click="make_admin(friend.user)"
                  >
                    Make Admin
                  </button>
                  <button
                    class="intbtn p-2 mx-2"
                    @click="mute_mem(friend.user)"
                  >
                    Mute
                  </button>
                  <button
                    class="intbtn p-2 mx-2"
                    @click="kick_mem(friend.user)"
                  >
                    Kick
                  </button>
                  <button class="intbtn p-2 mx-2" @click="ban_mem(friend.user)">
                    Ban
                  </button>
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
import { defineComponent, ref, computed, inject} from "vue";
import store from "@/store";
import { Socket } from "engine.io-client";
import { useWebSocket } from "@/plugins/websocket-plugin";

const { socket } = useWebSocket();
interface FriendsList {
  user: string;
  owner: boolean;
  admins: boolean;
  status: Boolean;
}

const mem_list = ref([] as FriendsList[]);

export default defineComponent({
  data() {
    return {
      userList: mem_list,
      src_friend: "" as string,
      selectedMemberIndex: null,
      searchQuery: "" as string,
      selectedChannel: null as string | null,
    };
  },
  setup() {
    // const socket = inject('socket');
    const mem = async () => {
      await store.dispatch("fetchCurrentChan");
      const chan = computed(() => store.getters.getCurrentCahnnel);
      const val_own = chan.value.owner;
      const val_ad = chan.value.admins;
      const val_mem = chan.value.members;
    //   console.log(chan.value);
      mem_list.value = [];
      if (val_own) {
        const new_own: FriendsList = {
          user: val_own.userName,
          owner: true,
          admins: false,
          status: false,
        };
        mem_list.value.push(new_own);
      }
      val_ad.forEach((item: any) => {
        const new_ad: FriendsList = {
          user: item.userName,
          owner: false,
          admins: true,
          status: false,
        };
        if (
          !mem_list.value.find((mems: FriendsList) => mems.user === new_ad.user)
        )
          mem_list.value.push(new_ad);
      });
      val_mem.forEach((item: any) => {
        const new_mem: FriendsList = {
          user: item.userName,
          owner: false,
          admins: false,
          status: false,
        };
        if (
          !mem_list.value.find(
            (mems: FriendsList) => mems.user === new_mem.user,
          )
        )
          mem_list.value.push(new_mem);
      });
    };
    mem();
  },
  created() {
    store.state.chat.socket.off("update_mem_list");
    store.state.chat.socket.off("update_admin");
    store.state.chat.socket.off("not_admin");
    socket.socket?.on
    store.state.chat.socket.on("update_mem_list", (data: any) => {
      if (data) {
        if (
          data.user != store.getters.getUserName &&
          localStorage.getItem("currentChanName") == data.chan_name
        ) {
        //   console.log(data);
          const new_mem: FriendsList = {
            user: data.user,
            owner: false,
            admins: false,
            status: false,
          };
          this.userList.push(new_mem);
        }
      }
    });
    store.state.chat.socket.on("update_admin", (data: any) => {
      if (data) {
        if (localStorage.getItem("currentChanName") == data.chan_name) {
          const index = this.userList.findIndex(
            (mems: FriendsList) => mems.user === data.admin,
          );
          if (index !== -1) this.userList.splice(index, 1);
          const new_ad: FriendsList = {
            user: data.admin,
            owner: false,
            admins: true,
            status: false,
          };
          if (
            !this.userList.find(
              (mems: FriendsList) => mems.user === new_ad.user,
            )
          )
            this.userList.push(new_ad);
        }
      }
    });
    store.state.chat.socket.on("leave_room_update", (data: any) => {
      if (data) {
        if (
          data.user != store.getters.getUserName &&
          localStorage.getItem("currentChanName") == data.chan_name
        ) {
          const index = this.userList.findIndex(
            (mems: FriendsList) => mems.user === data.user,
          );
          if (index !== -1) this.userList.splice(index, 1);
        }
      }
    });
    // this.listenForMuteEvents();
    this.listenForPermissionDenial();
    // store
  },
  computed: {
    searchMember(): FriendsList[] {
      return this.userList;
      //  .filter((item: string) =>
      //   item
      // item.user.toLowerCase().includes(this.searchQuery.toLowerCase())
      //   );
    },
  },
  methods: {
    closePage(): void {
      store.state.chat.socket.off("update_mem_list");
      this.$emit("close");
    },
    selectChannel(channel: string) {
      this.selectedChannel = channel;
    },
    showSelectedMember(index: any) {
      if (this.selectedMemberIndex === index) {
        this.selectedMemberIndex = null;
      } else {
        this.selectedMemberIndex = index;
      }
    },
    make_admin(member: string) {
      // console.log(member);
      // console.log(localStorage.getItem('currentChanName'));
      store.state.chat.socket.emit("set_admin", {
        admin_to_add: member,
        room_name: localStorage.getItem("currentChanName"),
      });
    },
    kick_mem(member: string) {
      store.state.chat.socket.emit("kick_user", {
        user_to_rem: member,
        room_name: localStorage.getItem("currentChanName"),
      });
    },
    send_invite(member: string)
    {
        socket.socket?.emit('invite', member);
        // console.log(this.$socket);
        // console.log("this is the members ", member);
    },
    mute_mem(member: string) {
      store.state.chat.socket.emit("mute_user", {
        user_to_mute: member,
        room_name: localStorage.getItem("currentChanName"),
      });
    },
    ban_mem(member: string) {
      store.state.chat.socket.emit("ban_user", {
        user_to_ban: member,
        room_name: localStorage.getItem("currentChanName"),
      });
    },
    listenForPermissionDenial() {
      store.state.chat.socket.on("not_admin", () => {
        this.$toast.add({
          severity: "warn",
          summary: "Action Denied",
          detail: `You do not have permission to mute users.`,
          life: 3000,
        });
      });
    },
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
