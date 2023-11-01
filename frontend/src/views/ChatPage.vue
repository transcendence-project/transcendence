<template>
  <div class="flex flex-wrap justify-between bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom text-white w-full m-5  rounded-md p-2.5 min-h-[85.9vh] text-center">
    <div class="w-full lg:w-1/5 m-0">
      <h2>Channel</h2>
      <!-- <div class="chan-cont"> -->
        <div class="flex-col items-center justify-center p-0 m-0 mt-5 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom  rounded-[10px]">
        <h4 class="py-2">Add</h4>
        <div>
          <input
            v-model="text"
            placeholder="Search channel"
            class="w-9/12 md:w-10/12 h-[1.5rem] border-0 text-black ml-2 rounded-md pl-4 mb-2 focus:border-0 focus:outline-none"
          />
        </div>
        <div class="flex justify-center m-0 mt-2 p-0 w-full h-[350px]">
          <ul class="w-[85%] p-1 m-1">
            <div v-for="(result, index) in filteredSearch" :key="index">
              <li class="list-none w-full mb-5">
                <div class="flex items-center justify-between mb-2 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-1 px-1 w-full rounded-[10px]">
                  {{ result.channel }}
                  {{ result.group }}
                  <ChannelOption class="relative" />
                </div>
              </li>
            </div>
          </ul>
        </div>
        <div class="flex items-center justify-center h-12">
          <ButtonComponent btnContent="Group"/>
          <ButtonComponent btnContent="DM"/>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-58 m-0 my-5">
      <h2>Chat</h2>
      <div class="flex-col items-center justify-center p-0 m-0 mt-5 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom">
        <div class="bg-white h-[420px] p-1 mb-2 m-1"></div>
        <div class="w-full">
          <input v-model="message" placeholder="message" 
          class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4
           mb-2 focus:border-0 focus:outline-none" />
           <ButtonComponent btnContent="Send"/>
        </div>
      </div>
    </div>
    <div class="catagory w-full lg:w-1/5 m-0">
      <h2>Catagory</h2>
      <div class="flex-col items-center justify-center p-1 m-0 mt-5 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom rounded-[10px]">
        <div>
          <ul>
            <div v-for="(result, index) in filteredSearch" :key="index">
              <li>
                <div class="flex bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom m-2.5 px-2 py-2 rounded-[10px]">
                  {{ result.user }}
                  <div v-if="result.friend">
                    <StatusUser :isFriend="result.friend" class="flex mt-[0.3rem]"/>
                  </div>
                  <div v-if="!result.friend">
                    <StatusUser :isFriend="result.friend" class="flex mt-[0.3rem]"/>
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChannelOption from "@/components/ChannelOption.vue";
import StatusUser from "@/components/StatusUser.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import io from 'socket.io-client';
import store from '../store'

interface ChannelList {
  channel: string;
  group: string;
  user: string;
  friend: boolean;
}

export default defineComponent({
  components: {
    ChannelOption,
    StatusUser,
    ButtonComponent,
  },
  data() {
    return {
      channels: [
        {
          channel: "fruits",
          group: "private",
          user: "orange",
		  friend: false,
        },
        {
			channel: "cars",
			group: "public",
			user: "mecedec",
			friend: true,
        },
        {
			channel: "plants",
			group: "public",
			user: "apple",
			friend: true,
        },
        {
          channel: "animals",
          group: "private",
          user: "dog",
          friend: false,
        },
      ] as ChannelList[],
      text: "" as string,
      message: "" as string,
      activeDropdownopt: null as number | null,
    };
  },
	created(){
		console.log(`test inside chatpage: ${store.state.chat.test}`);
			if (!store.state.chat.socket)
			{
				store.state.chat.socket = io('http://localhost:3000/chat', {
					auth: {
						token: localStorage.getItem('token'),
					},
				});
			}
	// 		store.state.chat.socket.on('create_room_success', () => { // event listener
	// 			console.log('Room created successfully and back in front end');
	// 		});
	// 		store.state.chat.socket.on('join_room_success', () => {
	// 			console.log('Joined the channel successfully and back in front end');
	// 		});
	// 		store.state.chat.socket.on('chan_msg_success', () => {
	// 			console.log('Send message to channel successfully and back in front end');
	// 		});
	// 		store.state.chat.socket.on('priv_msg_success', () => {
	// 			console.log('Send message to channel successfully and back in front end');
	// 		});
			
	// },
	// methods: {
	// 	create_room(){
	// 		if (store.state.chat.socket)
	// 			store.state.chat.socket.emit( 'create_room', 'azrachan');
	// 	},
	// 	join_chan(){
	// 		if (store.state.chat.socket)
	// 			store.state.chat.socket.emit('join_room', {room_name:'azrachan', arg: ""});
	// 	},
	// 	send_chan_msg(){
	// 		if (store.state.chat.socket)
	// 			store.state.chat.socket.emit('send_msg_to_chan', {room_name:'azrachan', message:'hello world'});
	// 	},
	// 	send_priv_msg(){
	// 		if (store.state.chat.socket)
	// 			store.state.chat.socket.emit('private_message')
	// 	}
	},
  computed: {
    filteredSearch(): ChannelList[] {
      return this.channels.filter((item) =>
        item.channel.toLowerCase().includes(this.text.toLowerCase())
      );
    },
  },
});
</script>
