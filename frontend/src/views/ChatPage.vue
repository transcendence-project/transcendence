<template>
  <div
    class="flex flex-wrap justify-between bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom text-white w-full m-5 rounded-md p-2.5 min-h-[85.9vh] text-center"
  >
    <div class="w-full lg:w-1/5 m-0 my-4">
      <h2>Channel</h2>
      <div
        class="flex-col items-center justify-center p-0 m-0 mt-5 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom rounded-[10px]"
      >
        <ButtonComponent
<<<<<<< HEAD
          btnContent="Add Channel"
=======
          btnContent="Create Channel"
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
          class="m-2"
          @click="AddChannelForm"
        />
        <CreateChannel v-if="isAddChannelForm" @close="closeAddChannelForm" />
        <div>
          <input
            placeholder="Search channel"
            @click="showSearchChannel"
            class="w-9/12 md:w-10/12 h-[1.5rem] border-0 text-black ml-2 rounded-md pl-4 mb-2 focus:border-0 focus:outline-none"
          />
        </div>
        <SearchChannel
          v-if="isSearchChannelVisible"
          @close="showSearchChannel"
        />
        <div class="flex justify-center m-0 mt-2 p-0 w-full h-[350px]">
          <ul class="w-[95%] p-1 m-1">
            <div v-for="(result, index) in filteredSearch" :key="index">
              <li class="list-none w-full mb-2">
                <a @click="showUserList(result)" class="cursor-pointer">
                  <div
<<<<<<< HEAD
                    class="flex items-center justify-between mb-2 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-1 w-full rounded-[10px]"
=======
                    class="flex items-center justify-between mb-2 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-3 px-1 w-full rounded-[10px]"
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
                  >
                    {{ result.channel }}
                    {{ result.group }}
                    <ChannelOption class="relative w-9 h-9" />
                  </div>
                </a>
              </li>
            </div>
          </ul>
        </div>
<<<<<<< HEAD

        <div class="chn-btm">
          <button class="grpbtn">Group</button>
          <button class="dmbtn">DM</button>
        </div>
=======
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
      </div>
    </div>
    <div class="w-full lg:w-58 m-0">
      <h1 class="text-2xl">Chat</h1>
      <div
<<<<<<< HEAD
        class="flex-col items-center justify-center p-2 m-1 mt-8 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom"
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

=======
        class="flex-col items-center justify-center p-0 m-0 mt-8 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom"
      >
        <div class="bg-white h-[420px] p-1 mb-5 m-1"></div>
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
        <div class="w-full">
          <input
            v-model="message"
            placeholder="message"
            class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none"
          />
<<<<<<< HEAD
          <ButtonComponent btnContent="Send" @click="sendMessage" />
=======
          <ButtonComponent btnContent="Send" />
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
        </div>
      </div>
    </div>
    <div class="catagory w-full lg:w-1/5 m-0 my-4">
      <h2>Channel members</h2>
      <div
        class="flex-col items-center justify-center p-1 m-0 mt-5 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom rounded-[10px]"
      >
        <div v-if="selectedItem">
          <ul>
            <li
              class="flex bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom m-2 px-1 py-1 rounded-[10px]"
              v-for="user in selectedItem.user"
              :key="user"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center">
                  {{ user }}
                </div>
                <div class="flex items-center">
                  <OptionMenu class="relative text-sm w-8 h-8" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChannelOption from "@/components/ChannelOption.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import CreateChannel from "@/components/CreateChannel.vue";
import OptionMenu from "@/components/OptionMenu.vue";
<<<<<<< HEAD
import SearchChannel from "@/components/SearchChannel.vue";
=======
import io from 'socket.io-client';
import store from "@/store";
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e

interface ChannelList {
  channel: string;
  group: string;
  user: string[];
  friend: boolean;
}

export default defineComponent({
  components: {
    ChannelOption,
    ButtonComponent,
    CreateChannel,
    OptionMenu,
<<<<<<< HEAD
    SearchChannel,
=======
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
  },
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
<<<<<<< HEAD
          channel: "computer",
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
          channel: "animals",
          group: "private",
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
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
      text: "" as string,
      message: "" as string,
      isAddChannelForm: false,
<<<<<<< HEAD
      isSearchChannelVisible: false,
      selectedItem: null as ChannelList | null,
      isMessageSent: false,
      chatMessage: [] as string[],
=======
      selectedItem: null as ChannelList | null,
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
    };
  },
  computed: {
    filteredSearch(): ChannelList[] {
      if (this.text === "") {
        return this.channels.filter((item) => item.group === "public");
      } else {
        return this.channels.filter((item) => {
          return (
            item.channel.toLowerCase().includes(this.text.toLowerCase()) &&
            item.group === "public"
          );
        });
      }
    },
  },
  methods: {
    AddChannelForm() {
      this.isAddChannelForm = true;
    },
    closeAddChannelForm() {
      this.isAddChannelForm = false;
    },
    showUserList(result: ChannelList) {
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
  },
	created(){
			if (!store.state.chat.socket)
			{
				store.state.chat.socket = io('http://localhost:3000/chat', {
					auth: {
						token: localStorage.getItem('token'),
					},
				});
			}
			store.dispatch('fetchAllChan');
			// console.log(store.getters.getTest);
			// console.log(store.getters.getAllChannel);
			store.state.chat.socket.on('create_room_success', () => { // event listener
				console.log('Room created successfully and back in front end');
			});
			store.state.chat.socket.on('join_room_success', () => {
				console.log('Joined the channel successfully and back in front end');
			});
			store.state.chat.socket.on('chan_msg_success', () => {
				console.log('Send message to channel successfully and back in front end');
			});
			store.state.chat.socket.on('priv_msg_success', () => {
				console.log('Send message to channel successfully and back in front end');
			});
			
	},
  methods: {
		create_room(){
			if (store.state.chat.socket)
				store.state.chat.socket.emit( 'create_room', 'azrachan');
		},
		join_chan(){
			if (store.state.chat.socket)
				store.state.chat.socket.emit('join_room', {room_name:'azrachan', arg: ""});
		},
		send_chan_msg(){
			if (store.state.chat.socket)
				store.state.chat.socket.emit('send_msg_to_chan', {room_name:'azrachan', message:'hello world'});
		},
		send_priv_msg(){
			if (store.state.chat.socket)
				store.state.chat.socket.emit('private_message')
		},
		AddChannelForm() {
		this.isAddChannelForm = true; // Open the component
		},
		closeAddChannelForm() {
		this.isAddChannelForm = false; // Close the component
		},
		showUserList(result: ChannelList) {
		this.selectedItem = result;
		},
  },
});
</script>

<style scoped>
.chn-btm {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.grpbtn,
.dmbtn {
  font-size: 0.8rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}
.grpbtn:hover,
.dmbtn:hover {
  background: #ae4488;
  color: #d9d9da;
}
</style>
