import { createStore } from 'vuex'

import {Socket}  from 'socket.io-client';


export default createStore({
  state: { // define the data (state) that you want to manage in your application. 
	chat:  {
		socket: null as Socket | null,
		test: "inside chat in store.. testingg",
	},
    game: {
        width: 0,
        height: 0,
    },
  },
  getters: { // used to retrieve computed properties or derived state from the store.
	getTest: (state: any) => state.chat.test,
  },
  mutations: { //used to modify the state. synchronous functions, take current state as argument & make changes to it. (i.e setters)
	setTest(state: any, new_test: string){
		state.chat.test = "this is a changes test";
	},
    setGameData(state:any, newData: string) {
        // state.gameData = { ...state.gameData, ...newData };
        // state.game.width = 
    },
  },
  actions: { // asynchronous functions used to perform operations and commit mutations, like API requests

	// axos requests to database
  },
  modules: { // allow you to organize your store into separate namespaces.
  }
})
