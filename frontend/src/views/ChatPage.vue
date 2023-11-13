<template>
  <div
    class="flex flex-wrap justify-between bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom text-white w-full min-h-[85.9vh] m-5 rounded-md p-2.5 text-center"
  >
    <div class="container w-full lg:w-1/6">
      <div class="row">
        <h2>My Channel</h2>
        <div class="my-2">
          <ButtonComponent
            class=""
            btnContent="Create Channel"
            @click="AddChannelForm"
          />
          <CreateChannel v-if="isAddChannelForm" @close="closeAddChannelForm" />
          <div class="my-2">
            <input
              placeholder="Search channel"
              @click="filteredSearchchanel"
              class="w-9/12 md:w-10/12 h-[1.5rem] border-0 text-black ml-2 rounded-md pl-4 mb-2 focus:border-0 focus:outline-none"
            />
          </div>
          <ChannelMembers v-if="isSearchChannelVisible" />
        </div>
      </div>
      <div class="row">
        <div class="w-full h-[250px] overflow-y-auto overflow-x-hidden">
          <ul class="w-[95%] p-1 m-1">
            <div v-for="(result, index) in filteredMyChannel" :key="index">
              <li class="list-none w-full mb-1">
                <div
                  class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[10px] chn-item"
                >
                  <a href="#" @click="showUserList(result.name)">
                    <div class="mx-2 px-5">
                      {{ result.name }}
                    </div>
                  </a>
                  <ChannelOption class="relative w-9 h-9" @click="leaveChan(result.name)"/>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <div class="row">
        Members List
        <div class="w-full h-[250px] overflow-y-auto overflow-x-hidden">
          <ul class="w-[95%] p-1 m-1">
            <div v-for="(user, index) in userList" :key="index">
              <li class="list-none w-full mb-1">
                <div
                  class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-1 p-1 w-full rounded-[10px] usr-item"
                >
                  <router-link to="/home">
                    <div class="mx-0 px-5">{{ user }}</div></router-link
                  >

                  <button class="intbtn">Invite</button>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="chn-btm my-3">
          <button class="grpbtn" @click="switch_to_group">Group</button>
          <button class="dmbtn" @click="switch_to_dm">DM</button>
        </div>
      </div>
    </div>

    <div class="container1 w-full lg:w-3/6 mx-2">
      <div class="row1">
        <h1 class="text-2xl">Chat</h1>
      </div>
      <div class="row1">
        <div
          class="bg-white h-[90%] p-1 mb-5 m-3 text-black"
          style="text-align: right"
        >
          <div v-for="(message, index) in allMessage" :key="index">
            <div
              class="bg-blue-500 text-grey-500 py-2 px-4 inline-block m-1 mx-5 rounded-md"
              style="max-width: 300px"
            >
              {{ message }}
            </div>
          </div>
        </div>
      </div>
      <div class="row1">

        <input
          v-model="message"
          placeholder="message"
          class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none"
        />
        <ButtonComponent btnContent="Send" @click="sendMessage" />
      </div>
    </div>

    <div class="container2 w-full lg:w-1/6">
      <div class="row2">
        <h2>All Channel</h2>
      </div>
      <div class="row2">
        Public Channels
        <div class="h-[250px] overflow-y-auto overflow-x-hidden">
          <ul class="w-[95%] p-1 mx-3">
            <div v-for="(result, index) in filteredPublicChannel" :key="index">
              <li class="list-none w-full mb-1">
                <div
                  class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[5px]"
                >
                  {{ result.name }}
                  <div class="relative">
                    <button class="jpub-btn" @click="join_pub_chan(result.name)">Join</button>
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <div class="row2">
        Private Channels
        <div class="h-[250px] overflow-y-auto overflow-x-hidden prv-chn">
          <ul class="w-[95%] p-1 mx-3">
            <div v-for="(result, index) in filteredPrivateChannel" :key="index">
              <li class="list-none w-full mb-1">
                <div
                  class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[5px]"
                >
                  {{ result.name }}
                  <div class="relative">
                    <ButtonComponent
                      btnContent="Join"
                      class="m-1"
                      @click="showPasswordForm(result.name)"
                    />
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <ChannelPassword v-if="isPrivate" @close="closePasswordFomr" />
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

const chan = ref([] as IChannel[]);
const m_chan = ref([] as IChannel[]);

export default defineComponent({
  data() {
    return {
      channels: chan,
      my_chan: m_chan,
      text: "" as string,
      message: "" as string,
      isAddChannelForm: false,
      isSearchChannelVisible: false,
      selectedItem: null as IChannel | null,
      isMessageSent: false,
      chatMessage: [] as string[],
      isPrivate: false,
      isMember: false,
      searchQuery: "" as string,
      userList: [] as string[],
      selectedChannel: null as IChannel | null,
	  inputText: '',
    };
  },
  setup() {
    const all = async () => {
      await store.dispatch("fetchAllChan");
      const channel = computed(() => store.getters.getAllChannel);
      // console.log(channel.value);
      const arrayProxy = channel.value;
      arrayProxy.forEach((item: any) => {
        // console.log(item);
        const new_chan: IChannel = {
          name: item.room_name,
          id: item.id,
          owner: null,
        //   messages: null,
          admins: null,
          members: [],
          invites: null,
          isPrivate: item.is_private,
          isProtected: item.is_protected,
          isPublic: item.is_public,
        //   password: item.password,
        };
        chan.value.push(new_chan);
      });
    };
    if (!chan.value.length)
		all();

	const my = async () => {
			await store.dispatch('fetchMyChan');
			const my_channel = computed(() => store.getters.getMyChannel);
			const arrayProxy_m = my_channel.value;
			arrayProxy_m.forEach((item: any) => {
				// console.log(item);
			const my_chan: IChannel = {
				name: item.room_name,
				id: item.id,
				owner: null,
				// messages: null,
				admins: null,
				members: [],
				invites: null,
				isPrivate: item.is_private,
				isProtected: item.is_protected,
				isPublic: item.is_public,
				// password: item.password,
			}
			m_chan.value.push(my_chan);
			});
		}
		if (!m_chan.value.length)
			my();
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
    filteredMyChannel(): IChannel[] {
      return this.my_chan.filter(
        (item: IChannel) =>
          item.name /* .toLowerCase().includes(this.searchQuery.toLowerCase()) &&
					item.member === true */
      );
    },
    filteredPublicChannel(): IChannel[] {
		return this.channels.filter(
		(item: IChannel) =>
			item.isPublic === true && 
			!this.my_chan.some((userChannel: IChannel) => userChannel.name === item.name)
		);
    },
    filteredPrivateChannel(): IChannel[] {
	return this.channels.filter(
		(item: IChannel) =>
			item.isProtected === true && 
			!this.my_chan.some((userChannel: IChannel) => userChannel.name === item.name)
		);
    },
	allMessage(): string[]{
		return this.chatMessage;
	},

  },
  methods: {
    join_pub_chan(room_name: string) {
      console.log("reached join chan");
      if (store.state.chat.socket)
        store.state.chat.socket.emit("join_room", {
          room_name: room_name,
          arg: "",
        });
    },
    switch_to_group() {
      localStorage.setItem("chat", "group");
      console.log(localStorage.getItem("chat"));
    },
    switch_to_dm() {
      localStorage.setItem("chat", "dm");
      console.log(localStorage.getItem("chat"));
    },
    send_chan_msg(message: string) {
		console.log(localStorage.getItem("currentChanName"));
      if (store.state.chat.socket)
        store.state.chat.socket.emit("send_msg_to_chan", {
          room_name: localStorage.getItem("currentChanName"),
          message: message,
        });
    },
    send_priv_msg() {
      if (store.state.chat.socket)
        store.state.chat.socket.emit("private_message");
    },
    showPasswordForm(chan: string) {
      this.isPrivate = true;
	  localStorage.setItem("toJoinChan", chan);
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
    showMyChannelList(result: IChannel) {
      this.selectedItem = result;
    },
    showSearchChannel() {
      this.isSearchChannelVisible = !this.isSearchChannelVisible;
    },
	leaveChan(chan_name: string){
		localStorage.setItem('chan_to_leave', chan_name);
	},
    async displayMessage() {
      this.chatMessage = [];
      const chan = computed(() => store.getters.getCurrentCahnnel);
      const val = chan.value.messages;
      val.forEach((item: any) => {
        this.chatMessage.push(item.content);
      });
    },
    sendMessage() {
    //   const chan = computed(() => store.getters.getCurrentCahnnel);
      console.log(this.message);
      if (this.message) {
        this.chatMessage.push(this.message);
        this.isMessageSent = true;
        this.send_chan_msg(this.message); // should also retrieve the chan name
        this.message = "";
      }
    },

    async showUserList(channel: string) {
      this.userList = [];
      localStorage.setItem("currentChanName", channel);
      await store.dispatch("fetchCurrentChan");
      const chan = computed(() => store.getters.getCurrentCahnnel);
      const val = chan.value.members;
      console.log(val);
      val.forEach((item: any) => {
        this.userList.push(item.userName);
      });
      await this.displayMessage();
    },
	

  },
  created() {
    if (!store.state.chat.socket) {
      store.state.chat.socket = io("ws://localhost:3000/chat", {
        auth: {
          token: localStorage.getItem("token"),
        },
      });
    }
    store.state.chat.socket.on("create_room_success", (data: any) => {
      // event listener
      console.log("Room created successfully and back in front end", data);
      if (data) {
        const newChannel: IChannel = {
          name: data.chan_name,
          id: data.id,
          owner: null,
        //   messages: null,
          admins: null,
          members: [],
          invites: null,
          isPrivate: data.isPrivate,
          isProtected: data.isProtected,
          isPublic: data.isPublic,
          // user: data.user,
        };
        this.channels.push(newChannel);
        this.my_chan.push(newChannel);
      }
    });
    store.state.chat.socket.on("join_room_success", (data: any) => {
      console.log("Joined the channel successfully and back in front end");
	  if (data){
        const newChannel: IChannel = {
          name: data.chan_name,
          id: data.id,
          owner: null,
        //   messages: null,
          admins: null,
          members: [],
          invites: null,
          isPrivate: data.isPrivate,
          isProtected: data.isProtected,
          isPublic: data.isPublic,
          // user: data.user,
        };
		this.my_chan.push(newChannel);
	  }
    });
	store.state.chat.socket.on("update_chan_list", (data: any) => {
		// console.log("reached update_chan_list in front end")
		if (data){
        const newChannel: IChannel = {
          name: data.chan_name,
          id: data.id,
          owner: null,
        //   messages: null,
          admins: null,
          members: [],
          invites: null,
          isPrivate: data.isPrivate,
          isProtected: data.isProtected,
          isPublic: data.isPublic,
          // user: data.user,
        };
		if (data.user != store.getters.getUserName)
			this.channels.push(newChannel);
	  }

	});
	store.state.chat.socket.on("update_chan_message", (data: any) => {
		if (data)
		{
			if (data.user != store.getters.getUserName && localStorage.getItem("currentChanName") == data.chan){
				this.chatMessage.push(data.content);
				this.isMessageSent = true;
			}
		}
	});
    store.state.chat.socket.on("priv_msg_success", () => {
      console.log("Send message to channel successfully and back in front end");
    });
	store.state.chat.socket.on("leave_room_success", (room_name: string) => {
		const index = this.my_chan.findIndex((channel: IChannel) => channel.name === room_name);
		if (index !== -1)
			this.my_chan.splice(index, 1);
	});
	store.state.chat.socket.on("update_mem_list", (data: any) => {
		if (data)
		{
			if (data.user != store.getters.getUserName && localStorage.getItem("currentChanName") == data.chan_name){
				this.userList.push(data.user);
			}
		}
	});
  },
});
</script>

<style scoped>
.container {
  margin: 1%;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 4fr 4fr 1fr;
  background-color: #ae4488;
  border-radius: 5px;
}
.container1 {
  margin: 1%;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 8fr 1fr;
  background-color: #ae4488;
  border-radius: 5px;
}
.container2 {
  margin: 1%;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 5fr 4fr;
  background-color: #ae4488;
  border-radius: 5px;
}

.row {
  text-align: center;
  padding: 10px;
}


.pub-btm {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding-bottom: 50;
}


.intbtn,
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

.intbtn:hover,
.jpub-btn:hover,
.chn-item:hover,
.grpbtn:hover,
.dmbtn:hover {
  background: #ae4488;
  color: #d9d9da;
}
.usr-item:hover {
  background: #6c4a5f;
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
.prv-chn {
  position: relative;
}
.add-pass {
  position: relative;
  top: 20px;
}
.bottomToTopInput {
	width: 200px;
	height: 100px;
	overflow-y: auto;
	border: 1px solid #ccc;
	resize: none;
	font-size: 16px;
	line-height: 1.5;
	padding: 10px;
	writing-mode: vertical-rl;
	white-space: nowrap;
  }

</style>


