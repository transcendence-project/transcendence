import Vue from "vue";
import { createStore } from "vuex";
import { IChannel } from "@/models/channel";
import axios, { AxiosResponse } from "axios";
import { Socket } from "socket.io-client";
import { IStudent } from "../models/student";
import { computed } from "vue";

export default createStore({
  state: {
    // define the data (state) that you want to manage in your application.
    chat: {
      socket: null as Socket | null,
      test: "inside chat in store.. testingg",
    },
    game: {
        
    },
  },
  getters: {
    // used to retrieve computed properties or derived state from the store.
    getTest: (state: any) => state.chat.test,
  },
  mutations: {
    //used to modify the state. synchronous functions, take current state as argument & make changes to it. (i.e setters)
    setTest(state: any, new_test: string) {
      state.chat.test = "this is a changes test";
    },
  },
  actions: {
  },
  modules: {
    // allow you to organize your store into separate namespaces.
  },
});
