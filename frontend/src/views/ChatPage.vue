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
          btnContent="Create Channel"
          class="m-2"
          @click="AddChannelForm"
        />
        <CreateChannel v-if="isAddChannelForm" @close="closeAddChannelForm" />
        <div>
          <input
            v-model="text"
            placeholder="Search channel"
            class="w-9/12 md:w-10/12 h-[1.5rem] border-0 text-black ml-2 rounded-md pl-4 mb-2 focus:border-0 focus:outline-none"
          />
        </div>
        <div class="flex justify-center m-0 mt-2 p-0 w-full h-[350px]">
          <ul class="w-[95%] p-1 m-1">
            <div v-for="(result, index) in filteredSearch" :key="index">
              <li class="list-none w-full mb-2">
                <a @click="showUserList(result)" class="cursor-pointer">
                  <div
                    class="flex items-center justify-between mb-2 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-3 px-1 w-full rounded-[10px]"
                  >
                    {{ result.name }}
                    {{ result.state }}
                    <ChannelOption class="relative w-9 h-9" />
                  </div>
                </a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-58 m-0">
      <h1 class="text-2xl">Chat</h1>
      <div
        class="flex-col items-center justify-center p-0 m-0 mt-8 w-full h-[500px] bg-gradient-to-r from-[#ae445a] to-[#662549] shadow-custom"
      >
        <div class="bg-white h-[420px] p-1 mb-5 m-1"></div>
        <div class="w-full">
          <input
            v-model="message"
            placeholder="message"
            class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none"
          />
          <ButtonComponent btnContent="Send" />
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

<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ChannelOption from "@/components/ChannelOption.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import CreateChannel from "@/components/CreateChannel.vue";
import OptionMenu from "@/components/OptionMenu.vue";
import io from 'socket.io-client';
import store from "@/store";
import { IChannel } from "@/models/channel";

const channels = ref([] as IChannel[]);
const text = ref("") as string;
const message = ref("") as string;
const isAddChannelForm = ref(false);
const selectedItem = ref<IChannel | null>(null);

const all = async () => {
  await store.dispatch('fetchAllChan');
  const channel = computed(() => store.getters.getAllChannel);
  console.log('hi');
  console.log(channel.value);
  const arrayProxy = channel.value;
  arrayProxy.forEach(item => {
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
	console.log(new_chan);
    channels.value.push(new_chan);
  });
};
// all();
const filteredSearch = computed(() => {
  return channels.value.filter((item) =>
    item.name.toLowerCase().includes(text.value.toLowerCase())
  );
});

const join_chan = () => {
  if (store.state.chat.socket) {
    store.state.chat.socket.emit('join_room', { room_name: 'azrachan', arg: "" });
  }
};

const send_chan_msg = () => {
  if (store.state.chat.socket) {
    store.state.chat.socket.emit('send_msg_to_chan', { room_name: 'azrachan', message: 'hello world' });
  }
};

const send_priv_msg = () => {
  if (store.state.chat.socket) {
    store.state.chat.socket.emit('private_message');
  }
};

const AddChannelForm = () => {
  isAddChannelForm.value = true; // Open the component
};

const closeAddChannelForm = () => {
  isAddChannelForm.value = false; // Close the component
};

const showUserList = (result: IChannel) => {
  selectedItem.value = result;
};

onMounted(() => {
  if (!store.state.chat.socket) {
    store.state.chat.socket = io('http://localhost:3000/chat', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  }
  // store.dispatch('fetchAllChan');
  store.state.chat.socket.on('create_room_success', (data: any) => {
    console.log('Room created successfully and back in front end', data);
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
      channels.value.push(newChannel);
    }
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
});
</script> -->

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import ChannelOption from "@/components/ChannelOption.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import CreateChannel from "@/components/CreateChannel.vue";
import OptionMenu from "@/components/OptionMenu.vue";
import io from 'socket.io-client';
import store from "@/store";
import { IChannel } from "@/models/channel";


export default defineComponent({
	setup(){
		const channels = ref([]);
		// channels.value = data().channels;
		const all = async () => {
			await store.dispatch('fetchAllChan');
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
			}
			// const channels = ref(data().channels);
			// console.log(this.channels);
			// this.channels.push(new_chan);
			});
			// this.channels = channel.value;
			// console.log('the next is this.channels');
			// console.log(this.channel);
		}
		all();
	},
  components: {
    ChannelOption,
    ButtonComponent,
    CreateChannel,
    OptionMenu,
  },
  data() {
    return {
      channels: computed(() => store.getters.getAllChannel),
      text: "" as string,
      message: "" as string,
      isAddChannelForm: false,
      selectedItem: null as IChannel | null,
    };
  },
  computed: {
    filteredSearch(): IChannel[] {
      return this.channels.filter((item: any) =>
	//   console.log(item)
	//   console.log(item.room_name)
        item.room_name/*.toLowerCase() .includes(this.text.toLowerCase()) */
      );
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
			// store.dispatch('fetchAllChan');
			store.state.chat.socket.on('create_room_success', (data: any) => { // event listener
				console.log('Room created successfully and back in front end', data);
				if (data)
				{
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
						// user: data.user,
					};
					this.channels.push(newChannel);
				}
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
			showUserList(result: IChannel) {
			this.selectedItem = result;
			},
	},
});
</script>
