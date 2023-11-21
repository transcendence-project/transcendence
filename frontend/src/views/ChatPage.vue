<template>
	<div
		class="flex flex-wrap justify-between bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom text-white w-full min-h-[85.9vh] m-5 rounded-md p-2.5 text-center">
		<div class="container flex flex-col min-h-[50vh] ">
			<div class="row mt-3">
				<h2 class="chn-head">My Channel</h2>
				<div class="flex-grow max-w-full">
					<div class="chn-btm">
						<button class="grpbtn px-2 mx-2" @click="showGroup">Group</button>
						<button class="dmbtn " @click="showDm">DM</button>
					</div>
				</div>
			</div>

			<div class="row flex-grow max-w-full">
				<div v-if="showGroupList">
					<div class="max-w-full mb-2">
						<ButtonComponent class="adbtn" btnContent="Create Channel" @click="AddChannelForm" />
						<CreateChannel v-if="isAddChannelForm" @close="closeAddChannelForm" />

						<ChannelMembers v-if="isSearchChannelVisible" />
					</div>
					<div class="flex-grow max-w-full">
						<input placeholder="Search channel" v-model="src_channel"
							class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none" />

						<div class="w-full h-[55vh] overflow-y-auto overflow-x-hidden flex-grow max-w-full">
							
							
	





							<ul class="w-[95%] p-2 m-2">
								<div v-for="(result, index) in filteredMyChannel" :key="index">
									<li class="list-none w-full mb-1">
										<div v-if="result.isPublic === true"
											class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-4 w-full rounded-[5px]">
											<a href="#" @click="showChatPage(result.name)">
												{{ result.name
												}}<span class="text-sm text-red-700"> public</span>
											</a>

											<div class="relative">
												<button class="optbtn px-1 my-1" @click="showSelectedFriend(index)">
													Options
												</button>
											</div>
										</div>
										<div v-else-if="result.isProtected === true"
											class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-4 w-full rounded-[5px]">
											<a href="#" @click="showChatPage(result.name)">
												{{ result.name
												}}<span class="text-sm text-green-700"> protected</span>
											</a>

											<div class="relative">
												<button class="optbtn px-1 my-1" @click="showSelectedFriend(index)">
													Options
												</button>
											</div>
										</div>
										<div v-else
											class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-4 w-full rounded-[5px]">
											<a href="#" @click="showChatPage(result.name)">
												{{ result.name
												}}<span class="text-sm text-green-700"> private</span>
											</a>

											<div class="relative">
												<button class="optbtn px-1 my-1" @click="showSelectedFriend(index)">
													Options
												</button>
											</div>
										</div>

										<div v-if="selectedFriendIndex === index && result.isPrivate === true" class="my-2 opt">
										<!-- <div v-if="selectedFriendIndex === index && result.isPrivate === true" class="my-2 opt"> -->
											<button class="intbtn p-2" @click="showMemberList(result.name)">
												members
											</button>
											<button class="intbtn p-2" @click="leave_room(result.name)">
												leave
											</button>
											<button class="intbtn p-2" @click="showAddMember(result.name)">
												add member
											</button>
											<AddMember v-if="addPrivateMember" @close="showAddMember"/>
									
										</div>
										<div v-else-if="selectedFriendIndex === index" class="my-2 opt">
										<!-- <div v-else-if="selectedFriendIndex === index" class="my-2 opt"> -->
											<button class="intbtn p-2" @click="showMemberList(result.name)">
												members
											</button>
											<button class="intbtn p-2" @click="leave_room(result.name)">
												leave
											</button>
						
										</div>
										<ChannelMembers v-if="isMembersList" @close="showMemberList" />
									</li>
								</div>
							</ul>



	

						</div>
					</div>
				</div>

				<div v-else>
					<div class="flex-grow max-w-full">
						<input placeholder="Search friend" v-model="src_friend"
							class="w-[80%] h-[2rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none" />

						<div class="w-full h-[60vh] overflow-y-auto overflow-x-hidden flex-grow max-w-full">
							<ul class="w-[95%] p-2 m-2">
								<div v-for="(friend, index) in searchFriends" :key="index">
									<li class="list-none w-full mb-1">
										<div
											class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom mx-1 p-1 w-full rounded-[10px] usr-item">
											<a href="#" @click="showChatPageFriend(friend.user)">
												<div class="mx-2 px-3">{{ friend.user }}</div>
											</a>

											<div>
												<button class="intbtn p-1">Invite</button>
												<button class="intbtn p-1">Block</button>
											</div>
										</div>
									</li>
								</div>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="container1 flex flex-col-reverse min-h-[50vh]">
			<div v-if="msgField">
				<h1 class="cht">Chat</h1>

				<div class="row1 flex-grow max-w-full">



					 <div class="flex flex-col bg-white h-[60vh] p-2 mb-10 m-3 text-black" style="text-align: right">
    <div class="overflow-y-auto overflow-x-hidden h-[55vh]">
        <div class="aa mx-3 text-black-600 text-xl text-center">{{ selectedRoom }}</div>
        <div v-for="(message, index) in allMessage" :key="index">
            <div v-if="message.send === true" class="bg-blue-400 text-grey-500 py-2 px-4 inline-block mx-5 my-1 rounded-md"> 
                {{ message.chat }}
            </div>
            <div v-else class="my-5 mx-5" style="text-align: left;">
                <span class="bg-blue-200 text-grey-500 py-2 px-3 inline rounded-md">
                    {{ message.chat }} 
                </span>
            </div>
        </div>
    </div>
</div>




					<div class="flex-grow max-w-full">
						<input v-model="message" placeholder="message"
						class="w-[80%] h-[2.5rem] border-0 text-black ml-2 mr-1 rounded-full pl-4 mb-2 focus:border-0 focus:outline-none"
						style="min-width: 300px" />
						<ButtonComponent btnContent="Send" @click="sendMessage" class="text" />
					</div>

				</div>
			</div>
			<div v-else>
				<div class="row1 flex-grow max-w-full">
					<span class="text-xl">Select a channel or a friend to chat</span>
				</div>
			</div>
		</div>

		<div class="container2 min-h-[50vh]">
			<div class="row2">
				<h2 class="chn-head my-5">All Channel</h2>
				<div class="my-2">Public Channels</div>
				<div class="h-[40vh] overflow-y-auto overflow-x-hidden">
					<ul class="w-[95%] p-1 mx-3">
						<div v-for="(result, index) in filteredPublicChannel" :key="index">
							<li class="list-none w-full mb-1">
								<div
									class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-4 w-full rounded-[5px]">
									{{ result.name }}
									<div class="relative">
										<button class="jpub-btn" @click="join_pub_chan(result.name)">
											Join
										</button>
									</div>
								</div>
							</li>
						</div>
					</ul>
				</div>

				<div class="my-2">Protected Channels</div>
				<div class="h-[30vh] overflow-y-auto overflow-x-hidden prv-chn">
					<ul class="w-[95%] p-1 mx-3">
						<div v-for="(result, index) in filteredPrivateChannel" :key="index">
							<li class="list-none w-full mb-1">
								<div
									class="flex items-center justify-between mb-1 bg-gradient-to-l from-[#ae4488] to-[#f39f5a] shadow-custom px-4 w-full rounded-[5px]">
									{{ result.name }}
									<div class="relative">
										<button class="jpub-btn" @click="showPasswordForm(result.name)">
											Join
										</button>
									</div>
								</div>
							</li>
						</div>
					</ul>
				</div>
				<!-- </div> -->

				<ChannelPassword v-if="isPrivate" @close="closePasswordFomr" />
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
import AddMember from "@/components/AddMember.vue";
import io from "socket.io-client";
import store from "@/store";
import { IChannel } from "@/models/channel";

const chan = ref([] as IChannel[]);
const m_chan = ref([] as IChannel[]);
const m_frnd = ref([] as FriendsList[]);
interface FriendsList {
  user: string;
  status: Boolean;
}


export default defineComponent({
  data() {
    return {
      channels: chan,
      my_chan: m_chan,
      src_friend: "" as string,
      src_channel: "" as string,
      message: "" as string,
      isAddChannelForm: false,
      isSearchChannelVisible: false,
      selectedItem: null as IChannel | null,
      isMessageSent: false,
      chatMessage: [] as {send: boolean; chat: string} [],
      isPrivate: false,
      isOptions: false,
      searchQuery: "" as string,
      userList: [] as string[],
      selectedChannel: null as IChannel | null,
      inputText: "",
      showGroupList: true,
      msgField: false,
      isMembersList: false,
	  selectedRoom: "" as string,
      selectedFriendIndex: null,
	  addPrivateMember: false,
	  
	  // for testing
      message1: "" as string,
	  testMessage: "" as String,
	  testMessages: [] as string [],
	allMessages: [] as string [],
	userInput1: "" as string,
	userInput2: "" as string,
	sndrcvmsg: [] as string[],
	// friends: m_frnd,
      friends: [
        {
          user: "one",
          status: true,
        },
        {
          user: "two",
          status: false,
        },
        {
          user: "three",
          status: true,
        },
        {
          user: "four",
          status: false,
        },
        {
          user: "five",
          status: true,
        },
        {
          user: "one",
          status: true,
        },
        {
          user: "two",
          status: false,
        },
        {
          user: "three",
          status: true,
        },
      ] as FriendsList[],
    };
  },
  setup() {
    const all = async () => {
      await store.dispatch("fetchAllChan");
      const channel = computed(() => store.getters.getAllChannel);
      const arrayProxy = channel.value;
      arrayProxy.forEach((item: any) => {
        const new_chan: IChannel = {
          name: item.room_name,
          id: item.id,
          isPrivate: item.is_private,
          isProtected: item.is_protected,
          isPublic: item.is_public,
        };
        chan.value.push(new_chan);
      });
    };
    if (!chan.value.length) all();
    const my = async () => {
      await store.dispatch("fetchMyChan");
      const my_channel = computed(() => store.getters.getMyChannel);
      const arrayProxy_m = my_channel.value;
      arrayProxy_m.forEach((item: any) => {
        const my_chan: IChannel = {
          name: item.room_name,
          id: item.id,
          isPrivate: item.is_private,
          isProtected: item.is_protected,
          isPublic: item.is_public,
        };
        m_chan.value.push(my_chan);
      });
    };
    if (!m_chan.value.length) my();
	const fr = async ()=> {
		await store.dispatch("fetchMyFriends");
		const my_friends = computed(() => store.getters.getMyFriends);
		// console.log(my_friends);
		const arrayProxy_f = my_friends.value;
		arrayProxy_f.forEach((item: any) => {
			const my_frnds: FriendsList = {
				user: item.userName,
				status: false,
			}
			m_frnd.value.push(my_frnds);
		});
	};
	if (!m_frnd.value.length) fr();
  },
  components: {
    ChannelOption,
    ButtonComponent,
    CreateChannel,
    OptionMenu,
    ChannelPassword,
    ChannelMembers,
    AddMember,
  },
  computed: {
    searchFriends(): FriendsList[] {
      return this.friends.filter((item: any) =>
        item.user/* .toLowerCase().includes(this.src_friend.toLowerCase()) */
      );
    },
    filteredMyChannel(): IChannel[] {
      return this.my_chan.filter(
        (item: IChannel) => item.name
        //   item.name.toLowerCase().includes(this.src_channel.toLowerCase())
      );
    },
    // filteredMyChannel(): IChannel[] {
    //   return this.my_chan.filter(
    // (item: IChannel) =>
    //   item.name /* .toLowerCase().includes(this.searchQuery.toLowerCase()) &&
    // item.member === true */
    //   );
    // },
    filteredPublicChannel(): IChannel[] {
      return this.channels.filter(
        (item: IChannel) =>
          item.isPublic === true &&
          !this.my_chan.some(
            (userChannel: IChannel) => userChannel.name === item.name
          )
      );
    },
    filteredPrivateChannel(): IChannel[] {
      return this.channels.filter(
        (item: IChannel) =>
          item.isProtected === true &&
          !this.my_chan.some(
            (userChannel: IChannel) => userChannel.name === item.name
          )
      );
    },
    allMessage(): any{
      return this.chatMessage;
    },

	
},
methods: {
	showAddMember(channel: string){
		localStorage.setItem("currentChanName", channel);
		this.addPrivateMember = !this.addPrivateMember;
	},
	
    showSelectedFriend(index: any) {
      if (this.selectedFriendIndex === index) {
        this.selectedFriendIndex = null;
      } else {
        this.selectedFriendIndex = index;
      }
    },
    showMemberList(channel: string) {
      this.isMembersList = !this.isMembersList;
      localStorage.setItem("currentChanName", channel);
    },
    showOptionButtons() {
      this.isOptions = !this.isOptions;
    },

    showGroup() {
      this.showGroupList = true;
    },
	
	async showChatPage(channel: string) {
      this.msgField = true;
      localStorage.setItem("currentChanName", channel);
      await this.displayMessage();
	  this.selectedRoom = channel;
    },
    async showChatPageFriend(friend: string) {
      this.msgField = true;
      localStorage.setItem("currentFriend", friend);
	//   console.log(localStorage.getItem("currentFriend"));
	  await this.displayFriendMessage();
	  this.selectedRoom = friend;
    },

    HideChatPage() {
      this.msgField = false;
    },
    showDm() {
      this.showGroupList = false;
    },
    join_pub_chan(room_name: string) {
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
	change_password() {
		if (store.state.chat.socket)
			store.state.chat.socket.emit("change_pass", {
				new_pass: "",
				room_name: localStorage.getItem("currentChanName"),
			});
	},
    showPasswordForm(chan_name: string) {
      this.isPrivate = true;
      localStorage.setItem("toJoinChan", chan_name);
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
    async displayMessage() {
      this.chatMessage = [];
      await store.dispatch("fetchCurrentChan");
      const chan = computed(() => store.getters.getCurrentCahnnel);
      console.log(chan.value.messages);
      const val = chan.value.messages;
      val.forEach((item: any) => {
		if (item.senderID === store.getters.getId)
			this.chatMessage.push({send: true, chat: item.content});
		else
			this.chatMessage.push({send: false, chat: item.content});
      });
    },
	async displayFriendMessage() {
		this.chatMessage = [];
		await store.dispatch("fetchCurrentFriend");
		const chan = computed(() => store.getters.getCurrentCahnnel);
		console.log(chan.value.messages);
		const val = chan.value.messages;
		val.forEach((item: any) => { // will change later similar to chat
			this.chatMessage.push({send: true, chat: item.content});
		});
    },
    sendMessage() {
		if (this.message) {
			this.chatMessage.push({send: true, chat: this.message});
			this.isMessageSent = true;
			this.send_chan_msg(this.message);
			this.message = "";
			
		}
    },

    closeChannelPage(): void {
      this.$emit("close");
    },
    leave_room(chan_name: string) {
      localStorage.setItem("chan_to_leave", chan_name);
      if (store.state.chat.socket) {
        store.state.chat.socket.emit(
          "leave_chan",
          localStorage.getItem("chan_to_leave")
        );
      }
    },
  },

  created() {
    if (!store.state.chat.socket) {
      console.log("establishing connection again");
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
          id: data.id,
          isPrivate: data.isPrivate,
          isProtected: data.isProtected,
          isPublic: data.isPublic,
        };
        this.my_chan.push(newChannel);
      }
    });
    store.state.chat.socket.on("join_room_success", (data: any) => {
      console.log("Joined the channel successfully and back in front end");
      if (data) {
        const newChannel: IChannel = {
          name: data.chan_name,
          id: data.id,
          isPrivate: data.isPrivate,
          isProtected: data.isProtected,
          isPublic: data.isPublic,
          // user: data.user,
        };
        this.my_chan.push(newChannel);
      }
    });
	store.state.chat.socket.on("join_priv_room", (chan_name: string) => {
		console.log("reached join room back in frontend")
		if (chan_name){
			store.state.chat.socket.emit("join_room", {
			room_name: chan_name,
			arg: "",
        });
	}
	});
    store.state.chat.socket.on("update_chan_list", (data: any) => {
      if (data) {
        const newChannel: IChannel = {
          name: data.chan_name,
          id: data.id,
          isPrivate: data.isPrivate,
          isProtected: data.isProtected,
          isPublic: data.isPublic,
        };
          this.channels.push(newChannel);
      }
    });
    store.state.chat.socket.on("update_chan_message", (data: any) => {
      console.log(localStorage.getItem("currentChanName"));
      console.log("reached update msg event listener");
      if (data) {
        if (
          data.user != store.getters.getUserName &&
          localStorage.getItem("currentChanName") == data.chan
        ) {
          this.chatMessage.push({send: false, chat: data.content});
          this.isMessageSent = true;
        }
      }
    });
    store.state.chat.socket.on("priv_msg_success", () => {
      console.log("Send message to channel successfully and back in front end");
    });
    store.state.chat.socket.on("leave_room_success", (room_name: string) => {
      const index = this.my_chan.findIndex(
        (channel: IChannel) => channel.name === room_name
      );
      console.log(index);
      if (index !== -1) this.my_chan.splice(index, 1);
    });
    store.state.chat.socket.on("kicked", (room_name: string) => {
      const index = this.my_chan.findIndex(
        (channel: IChannel) => channel.name === room_name
      );
      if (index !== -1) this.my_chan.splice(index, 1);
    });
  },
});
</script>

<style scoped>
.main-cont {
	display: flex;
	flex-direction: column;
}

.container {
	margin: 1%;
	flex: 1;

	display: grid;
	grid-template-rows: 2fr 8fr;
	background: linear-gradient(to bottom, #451952, #ae445a, #f39f5a);
	border-radius: 5px;
}

.container1 {
	margin: 1%;
	flex: 2;
	/* overflow-y: auto; */
	/* height: 55vh; */

	display: grid;
	grid-template-rows: 10fr;
	background: linear-gradient(to bottom, #451952, #ae445a, #f39f5a);
	border-radius: 5px;
}

.container2 {
	margin: 1%;
	flex: 1;

	display: grid;
	grid-template-rows: 10fr;
	background: linear-gradient(to bottom, #451952, #ae445a, #f39f5a);
	border-radius: 5px;
}

.cht {
	font-size: 3rem;
	font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
	font-style: Bold;
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

.adbtn {
	background: #f39f5a;
	/* color: #F39F5A;; */
}

.optbtn,
.intbtn {
	font-size: 0.8rem;
	color: white;
	padding-top: 0.6rem;
	padding-bottom: 0.6rem;
	background: #451952;
	border-radius: 5px;
	margin-left: 10px;
	cursor: pointer;
	color: white;

	border: none;
}

.grpbtn,
.dmbtn {
	font-size: 0.8rem;
	background: #f39f5a;
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	border-radius: 5px;
	margin-left: 10px;
	width: 25%;
	cursor: pointer;
	color: white;
	/* background: #451952; */
	border: none;
}

.chn-head {
	font-size: 1.2rem;
	font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
	font-style: initial;
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

.adbtn:hover,
.intbtn:hover,
.jpub-btn:hover,
.chn-item:hover,
.grpbtn:hover,
.dmbtn:hover {
	background: #ae4488;
	color: #d9d9da;
}

.optbtn:hover,
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
.right{
	text-align: right;
}
.left{
	text-align: left;
}
</style>
