<template>
  <div class="chat-cont">
    <div class="channel">
      <h2>Channel</h2>
      <div class="chan-cont">
        <h4 class="add-cont" @click="create_room">Add</h4>
        <div class="chn-srch">
          <input
            v-model="text"
            placeholder="Search channel"
            class="search-chn"
          />
        </div>
        <div class="chnul-cont">
          <ul>
            <div v-for="(result, index) in filteredSearch" :key="index">
              <li>
                <div class="chan-item">
                  {{ result.channel }}
                  {{ result.group }}
                  <ChannelOption />
                </div>
              </li>
            </div>
          </ul>
        </div>
        <div class="chn-btm">
          <button class="grpbtn">Group</button>
          <button class="dmbtn">DM</button>
        </div>
      </div>
    </div>
    <div class="message">
      <h2>Chat</h2>
      <div class="msg-cont">
        <div class="msg-display"></div>
        <div class="msg-input">
          <input v-model="message" placeholder="message" class="send-msg" />
          <button class="sndbtn">Send</button>
        </div>
      </div>
    </div>
    <div class="catagory">
      <h2>Catagory</h2>
      <div class="cat-cont">
        <div class="chnul-cont">
          <ul>
            <div v-for="(result, index) in filteredSearch" :key="index">
              <li>
                <div class="cat-item">
                  {{ result.user }}
                  <div v-if="result.friend">
                    <div class="cht-usr-avail"></div>
                  </div>
                  <div v-if="!result.friend">
                    <div class="cht-usr-not-avail"></div>
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
import { ref, onMounted,  defineComponent } from "vue";
import ChannelOption from "@/components/ChannelOption.vue";
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
	},
	created(){
		console.log(store.state.chat.test);
		if (!store.state.chat.socket)
		{
			store.state.chat.socket = io("http://localhost:3000", {
				auth: {
					token: localStorage.getItem('token'),
				},
			});
		}
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
	}
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
  computed: {
    filteredSearch(): ChannelList[] {
      return this.channels.filter((item) =>
        item.channel.toLowerCase().includes(this.text.toLowerCase())
      );
    },
  },
});
</script>


<style scoped>

.chat-cont {
  display: flex;
  flex-wrap: wrap; 
  justify-content: space-between;
  background: #24272c;
  color: white;
  margin: 20px;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  min-height: 100vh; 
}

@media screen and (min-width: 768px) {
  .channel {
    width: 20%;
  }
  
  .message {
    width: 58%;
  }
  
  .catagory {
    width: 20%;
  }
}

@media screen and (max-width: 767px) {
  .channel,
  .message,
  .catagory {
    width: 100%; 
    margin: 0; 
  }
}

@media screen and (max-width: 480px) {
  .add-cont,
  .chn-srch {
    width: 100%;
  }
  
}
.chan-cont,
.cat-cont,
.msg-cont {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  margin-top: 20px;
  width: 100%;
  height: 500px;
  background: #34373d;
}

.chnul-cont {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 350px;
}
.chnul-cont ul {
  width: 85%;
  padding: 5px;
  margin: 5px;
}
.chnul-cont li {
  list-style-type: none;
  width: 100%;
}

.search-chn {
  width: 85%;
  height: 1.5rem;
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  padding-left: 15px;
  margin-bottom: 10px;
}
.search-chn:focus {
  border: none;
  outline: none;
}
.chn-btm {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}



.msg-display {
  background: white;
  height: 420px;
  padding: 5px;
  margin-bottom: 10px;
  margin: 5px;
}
.msg-input {
  width: 100%;
}
.send-msg {
  width: 80%;
  height: 2rem;
  border: none;
  margin-left: 10px;
  margin-right: 5px;
  border-radius: 10px;
  padding-left: 15px;
  margin-bottom: 10px;
}
.send-msg:focus {
  border: none;
  outline: none;
}
.grpbtn,
.dmbtn,
.sndbtn {
  font-size: 0.8rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  color: white;
  background: #697692;
  border: none;
}
.grpbtn:hover,
.dmbtn:hover,
.sndbtn:hover {
  background: #7c8392;
  color: #d9d9da;
}

.dropdownopt {
  position: relative;
}

.dropdownopt a {
  cursor: pointer;
}

.dropdownopt-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
}

.dropdownopt.active .dropdownopt-menu {
  display: block;
}

.dropdownopt-menu li {
  padding: 8px 16px;
  border-top: 1px solid #ccc;
}

.dropdownopt-menu li a {
  text-decoration: none;
  color: #333;
  display: block;
}

.dropdownopt-menu li a:hover {
  background-color: #f2f2f2;
}
.chan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #61656e;
  margin: 3px;
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
}
.cat-item {
	display: flex;
  background: #61656e;
  margin: 3px;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.cht-usr-avail {
	display: flex;
  width: 0.6rem;
  height: 0.6rem;
  margin-top: .3rem;
  margin-left: 0.3rem;
  border-radius: 50%;
  border-style: groove;
  background: green;
}
.cht-usr-not-avail {
  display: flex;
  width: 0.6rem;
  height: 0.6rem;
  margin-top: .3rem;
  margin-left: 0.3rem;
  border-radius: 50%;
  border-style: groove;
  background: rgb(231, 8, 8);
}
</style>