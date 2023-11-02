import { createStore } from 'vuex'
import { IChannel } from '@/models/channel';
import axios, { AxiosResponse } from "axios";
import {Socket}  from 'socket.io-client';


export default createStore({
  state: { // define the data (state) that you want to manage in your application. 
	chat:  {
		socket: null as Socket | null,
		all_channels: [] as IChannel[],
		my_channels: [] as IChannel[],
		current_channel: null as IChannel | null, // is not any array, just one channel
		test: "inside chat in store.. testingg",
	},
  },
  getters: { // used to retrieve computed properties or derived state from the store.
	getTest: (state: any) => state.chat.test,
	getAllChannel: (state: any) => state.chat.all_channels,
	getMyChannel: (state: any) => state.chat.my_channels,
	getCurrentCahnnel: (state: any) => state.chat.current_channel,
  },
  mutations: { //used to modify the state. synchronous functions, take current state as argument & make changes to it. (i.e setters)
	setTest(state: any, new_test: string){
		state.chat.test = "this is a changes test";
	},
	setAllChannel(state: any, all_chan: any){
		console.log('inside setAllChannel');
		state.chat.all_chanels = all_chan; // or push?
	},
	setMyChannel(state: any, my_chan: any){
		state.chat.my_channels = my_chan; // or push?
	},
	setCurrentChannel(state: any, cur_chan: any){
		state.chat.current_channel = cur_chan;
	}
  },
  actions: { // asynchronous functions used to perform operations and commit mutations, like API requests
	fetchAllChan(context: any) {
		axios.get("http://localhost:3000/chat/all_channels")
		.then((resp: AxiosResponse<IChannel[]>) => {
			const channels = resp.data;
			// console.log(channels);
				context.commit('setAllChannel', channels);
			})
			.catch((error) => {
				console.error("Error fetching all channels:", error);
			});
	},
	fetchMyChan(conetxt: any) {
		axios.get("http://localhost:3000/users/my_channels").then((resp: AxiosResponse<IChannel[]>) => {
		const my_channels = resp.data;
		conetxt.commit('setMyChannels', my_channels);
		}).catch((error) => {
			console.error("Error fetching my channels:", error);
		});
	}
	// axos requests to database
  },
  modules: { // allow you to organize your store into separate namespaces.
  }
})
