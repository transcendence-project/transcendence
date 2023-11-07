<template>
  <div
    class="flex flex-wrap justify-between bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom text-white w-full m-5 rounded-md p-2.5 min-h-[85.9vh] text-center"
  >
    <div class="flex-col items-center justify-between w-full lg:w-1/5 m-0 my-4">
      <h2>My Channel</h2>
      <div
        class="flex-col items-center justify-between p-0 m-0 mt-5 w-full h-[80%] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom rounded-[10px]"
      >
        <ButtonComponent
          btnContent="Create Channel"
          class="m-2"
          @click="AddChannelForm"
        />
        <CreateChannel v-if="isAddChannelForm" @close="closeAddChannelForm" />
        <div>
          <input
            placeholder="Search channel"
            class="w-9/12 md:w-10/12 h-[1.5rem] border-0 text-black ml-2 rounded-md pl-4 mb-2 focus:border-0 focus:outline-none"
          />
        </div>
        <ChannelMembers v-if="isSearchChannelVisible" @close="showSearchChannel" />
        <div class="flex justify-between m-0 mt-2 p-0 w-full">
          <div class="w-full h-[350px] overflow-y-auto">
            <ul class="w-[95%] p-1 m-1">
              <div v-for="(result, index) in filteredMyChannel" :key="index">
                <li class="list-none w-full mb-2">
                  <div
                    class="flex items-center justify-between mb-2 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[10px]"
                  >
                    {{ result.channel }}
                    <ChannelOption class="relative w-9 h-9" />
                  </div>
                </li>
              </div>
            </ul>
          </div>
        </div>

        <div class="chn-btm">
          <button class="grpbtn">Group</button>
          <button class="dmbtn">DM</button>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-58 m-0">
      <h1 class="text-2xl">Chat</h1>
      <div
        class="flex-col items-center justify-center p-2 m-1 mt-8 w-full h-[77%] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom"
      >
        <div
          class="bg-white h-[420px] p-1 mb-5 m-1 text-black"
          style="text-align: right"
        >
          <div v-for="(chatMessage, index) in chatMessage" :key="index">
            <div
              class="bg-gray-500 text-black py-2 px-4 inline-block m-1 mx-5 rounded-md"
              style="max-width: 300px"
            >
              {{ chatMessage }}
            </div>
          </div>
        </div>

        <div class="w-full">
          <input
            v-model="message"
            placeholder="message"
            class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none"
          />
          <ButtonComponent btnContent="Send" @click="sendMessage" />
        </div>
      </div>
    </div>
    <div class="flex-col items-center justify-center w-full lg:w-1/5 m-0 my-1">
      <h2>All Channel</h2>
      <div
        class="flex-col items-center justify-center p-0 m-0 mt-5 w-full h-[80%] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom rounded-[5px]"
      >
        <div class="all-chn">
          <div class="pub-div">
            <div class="text-lb m-2">
              Public Channels
              <div class="flex justify-between m-0 mt-2 p-0">
                <div class="h-[250px] overflow-y-auto">
                  <ul>
                    <div
                      v-for="(result, index) in filteredPublicChannel"
                      :key="index"
                    >
                      <li class="list-none w-full">
                        <div
                          class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[5px]"
                        >
                          {{ result.channel }}
                          <div class="relative">
                            <button class="jpub-btn">Join</button>
                          </div>
                        </div>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="pri-div">
            Private Channels
            <div class="flex justify-between m-0 mt-2 p-0">
              <div class="h-[250px] overflow-y-auto">
                <ul>
                  <div
                    v-for="(result, index) in filteredPrivateChannel"
                    :key="index"
                  >
                    <li class="list-none w-full">
                      <div
                        class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[5px]"
                      >
                        {{ result.channel }}
                        <div class="relative">
                          <ButtonComponent
                            btnContent="Join"
                            class="m-2"
                            @click="showPasswordForm"
                          />
                          <!-- <button class="jpub-btn" @click="isChannelPrivate">Join</button> -->
                        </div>
                      </div>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <ChannelPassword v-if="isPrivate" @close="closeisChannelPrivate" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import ChannelOption from "@/components/ChannelOption.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import CreateChannel from "@/components/CreateChannel.vue";
import OptionMenu from "@/components/OptionMenu.vue";
import ChannelPassword from "@/components/ChannelPassword.vue";
import ChannelMembers from "@/components/ChannelMembers.vue";
import io from "socket.io-client";
import store from "@/store";
import { IChannel } from "@/models/channel";

export interface TestChannelList {
  channel: string;
  group: string;
  user: string[];
  friend: boolean;
  member: boolean;
}

export default defineComponent({
  data() {
    return {
      channels: computed(() => store.getters.getAllChannel),
      text: "" as string,
      message: "" as string,
      isAddChannelForm: false,
      isSearchChannelVisible: false,
      selectedItem: null as TestChannelList | null,
      isMessageSent: false,
      chatMessage: [] as string[],
      isPrivate: false,
	  isMember: false,

      testchannels: [
        {
          channel: "fruits",
          group: "private",
          user: ["orange", "banana", "apple", "lemon", "peach"],
          friend: false,
          member: false,
        },
        {
          channel: "microsoft",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "dell",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "toshiba",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "computer",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "laptop",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "systems",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "techonogy",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: true,
        },
        {
          channel: "robotic",
          group: "private",
          user: ["monitor", "window", "cpu", "mouse", "keybord"],
          friend: false,
          member: false,
        },
        {
          channel: "furniture",
          group: "public",
          user: ["door", "chair", "bed", "table", "tv", "gate"],
          friend: false,
          member: true,
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
          member: true,
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
          member: false,
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
          member: true,
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
          member: false,
        },
      ] as TestChannelList[],
      searchQuery: "" as string,
    };
  },
  setup() {
    const channels = ref([]);
    // channels.value = data().channels;
    const all = async () => {
      await store.dispatch("fetchAllChan");
      const channel = computed(() => store.getters.getAllChannel);
      // console.log(channel.value);
      const arrayProxy = channel.value;
      arrayProxy.forEach((item: any) => {
        const new_chan: IChannel = {
          name: item.chan_name,
          state: item.state,
          id: item.id,
          owner: null,
          messages: null,
          admins: null,
          members: null,
          invites: null,
          password: item.pass,
        };
      });
    };
    all();
  },
  components: {
    ChannelOption,
    ButtonComponent,
    CreateChannel,
    OptionMenu,
    ChannelPassword,
    ChannelMembers,
},
  computed: {
    filteredMyChannel(): TestChannelList[] {
      return this.testchannels.filter(
        (item: TestChannelList) =>
          item.channel.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          item.member === true
      );
    },
    filteredPublicChannel(): TestChannelList[] {
      return this.testchannels.filter(
        (item: TestChannelList) =>
          item.channel.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          item.group === "public"
      );
    },
    filteredPrivateChannel(): TestChannelList[] {
      return this.testchannels.filter(
        (item: TestChannelList) =>
          item.channel.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          item.group === "private"
      );
    },
  },
  methods: {
    join_chan() {
      if (store.state.chat.socket)
        store.state.chat.socket.emit("join_room", {
          room_name: "azrachan",
          arg: "",
        });
    },
    send_chan_msg() {
      if (store.state.chat.socket)
        store.state.chat.socket.emit("send_msg_to_chan", {
          room_name: "azrachan",
          message: "hello world",
        });
    },
    send_priv_msg() {
      if (store.state.chat.socket)
        store.state.chat.socket.emit("private_message");
    },
    showPasswordForm() {
      this.isPrivate = true;
    },
    closePasswordFomr() {
      this.isPrivate = false;
    },
    AddChannelForm() {
      this.isAddChannelForm = true;
    },
    closeAddChannelForm() {
      this.isAddChannelForm = false;
    },
    showMyChannelList(result: TestChannelList) {
      this.selectedItem = result;
    },
    showSearchChannel() {
      this.isSearchChannelVisible = !this.isSearchChannelVisible;
    },
    sendMessage() {
      if (this.message) {
        this.chatMessage.push(this.message);
        this.isMessageSent = true;
        this.message = "";
      }
    },
	showChannelMembers(){
		this.isMember = true;
	},

	closeChannelMembers(){
		this.isMember = false;
	},
  },
  created() {
    if (!store.state.chat.socket) {
      store.state.chat.socket = io("http://localhost:3000/chat", {
        auth: {
          token: localStorage.getItem("token"),
        },
      });
    }
    store.state.chat.socket.on("create_room_success", (data: any) => {
      console.log("Room created successfully and back in front end", data);
      if (data) {
        const newChannel: IChannel = {
          name: data.chan_name,
          state: data.state,
          id: data.id,
          owner: null,
          messages: null,
          admins: null,
          members: null,
          invites: null,
          password: data.pass,
        };
        this.channels.push(newChannel);
      }
    });
    store.state.chat.socket.on("join_room_success", () => {
      console.log("Joined the channel successfully and back in front end");
    });
    store.state.chat.socket.on("chan_msg_success", () => {
      console.log("Send message to channel successfully and back in front end");
    });
    store.state.chat.socket.on("priv_msg_success", () => {
      console.log("Send message to channel successfully and back in front end");
    });
  },
});
</script>

<style scoped>
.pub-btm {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding-bottom: 50;
}
.flex-col.items-center.justify-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.grpbtn,
.dmbtn {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}
.jpub-btn {
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

.jpub-btn:hover {
  background: #ae4488;
  color: #d9d9da;
}

.grpbtn:hover,
.dmbtn:hover {
  background: #ae4488;
  color: #d9d9da;
}
.all-chn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.pub-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.pri-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
