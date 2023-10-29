import { createStore } from 'vuex'

import {Socket}  from 'socket.io-client';


export default createStore({
  state: {
	chat:  {
		socket: null as Socket | null,
		test: "inside chat in store.. testingg",
	},
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
