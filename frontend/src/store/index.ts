import Vue from 'vue'
import { createStore } from 'vuex'
import { IChannel } from '@/models/channel';
import axios, { AxiosResponse } from "axios";
import { Socket } from 'socket.io-client';
import { IStudent } from '../models/student';
import { computed } from 'vue';


const store = createStore({
	state: { // define the data (state) that you want to manage in your application. 
		user: <IStudent>{
			id: 0,
			display_name: "",
			username: "",
			email: "",
			image: "",
			status: "",
			win: 0,
			lose: 0,
			draw: 0,
			rank: 0,
		},
		chat: {
			socket: null as Socket | null,
			all_channels: [],
			my_channels: [] as IChannel[],
			current_channel: null as IChannel | null, // is not any array, just one channel
			test: "inside chat in store.. testingg",
		},
	},
	getters: { // used to retrieve computed properties or derived state from the store.

		// GETTERS FOR CHAT
		getTest: (state: any) => state.chat.test,
		getAllChannel: (state: any) => state.chat.all_channels,
		getMyChannel: (state: any) => state.chat.my_channels,
		getCurrentCahnnel: (state: any) => state.chat.current_channel,

		// GETTERS FOR USER
		getId: (state: any) => state.user.id,
		getDisplayName: (state: any) => state.user.display_name,
		getUserName: (state: any) => state.user.username,
		getEmail: (state: any) => state.user.email,
		getImage: (state: any) => state.user.image,
		getStatus: (state: any) => state.user.status,
		getWin: (state: any) => state.user.win,
		getLose: (state: any) => state.user.lose,
		getDraw: (state: any) => state.user.draw,
		getRank: (state: any) => state.user.rank,

	},
	mutations: { //used to modify the state. synchronous functions, take current state as argument & make changes to it. (i.e setters)

		// SETTERS FOR CHAT
		setTest(state: any, new_test: string) {
			state.chat.test = "this is a changes test";
		},
		setAllChannel(state: any, all_chan: any) {
			console.log('inside setAllChannel');
			state.chat.all_channels = all_chan; // or push?
			// state.chat.all_channels.push(all_chan);
		},
		setMyChannel(state: any, my_chan: any) {
			state.chat.my_channels = my_chan; // or push?
		},
		setCurrentChannel(state: any, cur_chan: any) {
			state.chat.current_channel = cur_chan;
		},

		// SETTERS FOR USER
		setId(state: any, id: number) {
			state.user.id = id;
		},
		setDisplayName(state: any, name: string) {
			state.user.display_name = name;
		},
		setUserName(state: any, u_name: string) {
			state.user.username = u_name;
		},
		setEmail(state: any, email: string) {
			state.user.email = email;
		},
		setImage(state: any, image: string) {
			state.user.image = image;
		},
		setStatus(state: any, status: string) {
			state.user.status = status;
		},
		incremenetWin(state: any, wins: number) {
			state.user.win++;
		},
		incremenetLose(state: any, loses: number) {
			state.user.lose++;
		},
		incremenetDraw(state: any, draw: number) {
			state.user.draw++;
		},
		setRank(state: any, rank: number) {
			state.user.rank = rank;
		},
	},
	actions: { // asynchronous functions used to perform operations and commit mutations, like API requests
		// axios requests to database / backend
		fetchUserData(context: any) {
			console.log("inside fetch user data");
			axios.get('http://localhost:3000/auth/me', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}).then((response) => {
				store.commit('setId', response.data.id);
				store.commit('setDisplayName', response.data.fullname);
				store.commit('setUserName', response.data.userName);
				store.commit('setEmail', response.data.email);
				store.commit('setImage', response.data.image);
			}).catch((error) => {
				console.error('An error occurred while fetching data:', error);
			});
		},
		async fetchAllChan(context: any) {
			const resp = await axios.get("http://localhost:3000/chat/all_channels");
			const all_chan = resp.data;
			context.commit('setAllChannel', all_chan);
			// const get_chan =  store.getters.getAllChannel;
			// console.log(get_chan);
			// console.error("Error fetching all channels:", error);
		},
		fetchMyChan(conetxt: any) {
			axios.get("http://localhost:3000/users/my_channels").then((resp: AxiosResponse<IChannel[]>) => {
				const my_channels = resp.data;
				conetxt.commit('setMyChannels', my_channels);
			}).catch((error) => {
				console.error("Error fetching my channels:", error);
			});
		}
	},
	modules: { // allow you to organize your store into separate namespaces.
	}
});

export default store;
