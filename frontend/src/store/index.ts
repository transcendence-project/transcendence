import Vue from "vue";
import { createStore } from "vuex";
import { IChannel } from "@/models/channel";
import axios, { AxiosResponse } from "axios";
import { Socket } from "socket.io-client";
import { IStudent } from "../models/student";
import { computed } from "vue";
import { IFriend } from "@/models/friend";
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import { jwtDecoded } from "@/router";
import axiosInstance from "../axiosconfig";

const store = createStore({
  state: {
    // define the data (state) that you want to manage in your application.
    user: <IStudent>{
      id: 0,
      display_name: "",
      username: "",
      email: "",
      image: "",
      status: "",
      wins: 0,
      loses: 0,
      draw: 0,
      rank: 0,
    },
    chat: {
      socket: null as Socket | null,
      all_channels: [],
      my_channels: [] as IChannel[],
      my_friends: [] as IChannel[],
      my_blocked: [] as string[],
      current_chan_name: "",
      current_friend: "",
      current_channel: null,
    },
  },
  getters: {
    // GETTERS FOR CHAT
    getAllChannel: (state: any) => state.chat.all_channels,
    getMyChannel: (state: any) => state.chat.my_channels,
    getCurrentCahnnel: (state: any) => state.chat.current_channel,
    getCurrentFriend: (state: any) => state.chat.current_friend,
    getMyFriends: (state: any) => state.chat.my_friends,
    getMyBlocked: (state: any) => state.chat.my_blocked,

    // GETTERS FOR USER
    getId: (state: any) => state.user.id,
    getDisplayName: (state: any) => state.user.display_name,
    getUserName: (state: any) => state.user.username,
    getEmail: (state: any) => state.user.email,
    getImage: (state: any) => state.user.image,
    getStatus: (state: any) => state.user.status,
    getWin: (state: any) => state.user.wins,
    getLose: (state: any) => state.user.loses,
    getDraw: (state: any) => state.user.draw,
    getRank: (state: any) => state.user.rank,
    getMatches: (state: any) => state.user.matches,
    getAchievements: (state: any) => state.user.achievements,
  },
  mutations: {
    //used to modify the state. synchronous functions, take current state as argument & make changes to it. (i.e setters)

    // SETTERS FOR CHAT
    setAllChannel(state: any, all_chan: any) {
      state.chat.all_channels = all_chan; // or push?
      // state.chat.all_channels.push(all_chan);
    },
    setMyChannel(state: any, my_chan: any) {
      state.chat.my_channels = my_chan; // or push?
    },
    setCurrentChannel(state: any, cur_chan: any) {
      state.chat.current_channel = cur_chan;
    },
    setMyFriends(state: any, my_frnds: any) {
      state.chat.my_friends = my_frnds;
    },
    setCurrentFriend(state: any, cur_frnd: any) {
      state.chat.current_friend = cur_frnd;
    },
    setMyBlocked(state: any, my_blckd: string[]) {
      state.chat.my_blocked = my_blckd;
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
    // incremenetWin(state: any, wins: number) {
    //   state.user.win++;
    // },
    // incremenetLose(state: any, loses: number) {
    //   state.user.lose++;
    // },
    // incremenetDraw(state: any, draw: number) {
    //   state.user.draw++;
    // },
    setRank(state: any, rank: number) {
      state.user.rank = rank;
    },
    setWins(state: any, wins: number) {
      state.user.wins = wins;
    },
    setLoses(state: any, loses: number) {
      state.user.loses = loses;
    },
    setMatches(state: any, matches: any) {
      state.user.matches = matches;
    },
    setAchievements(state: any, achievements: any) {
      state.user.achievements = achievements;
    },
  },
  actions: {
    // asynchronous functions used to perform operations and commit mutations, like API requests
    // axios requests to database / backend
    fetchUserData(context: any) {
      //   console.log("inside fetch user data");
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + "/auth/me")
        .then((response) => {
          //   console.log("response dataaaaa: ", response.data);
          store.commit("setId", response.data.id);
          store.commit("setDisplayName", response.data.fullname);
          store.commit("setUserName", response.data.userName);
          store.commit("setEmail", response.data.email);
          store.commit("setImage", response.data.image);
          store.commit("setWins", response.data.wins);
          store.commit("setLoses", response.data.loses);
          store.commit("setRank", response.data.points);
          localStorage.setItem(
            "Is2FAEnabled",
            response.data.is2FAEnabled.toString(),
          );
          //   console.log(
          //     "the is2fa in fetchuser: ",
          //     response.data.is2FAEnabled.toString(),
          //   );
          //   store.commit("setAchievments", response.data.achievments);
          //   store.commit("setAuthenticated", true);
          // router.push("/home");
        })
        .catch((error) => {
          console.error("An error occurred while fetching dataaaaaa:", error);
          router.push("/");
        });
    },
    async fetchAllChan(context: any) {
      const resp = await axiosInstance.get(
        process.env.VUE_APP_BACKEND_URL + "/chat/all_channels",
      );
      const all_chan = resp.data;
      context.commit("setAllChannel", all_chan);
      // const get_chan =  store.getters.getAllChannel;
      // console.log(get_chan);
      // console.error("Error fetching all channels:", error);
    },
    async fetchMyChan(context: any) {
      //   console.log("inside fetch my chan");
      const resp = await axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + "/users/my/channels")
        .then((resp: AxiosResponse<IChannel[]>) => {
          const my_channels = resp.data;
          context.commit("setMyChannel", my_channels);
        })
        .catch((error) => {
          console.error("Error fetching my channels:", error);
        });
    },
    async fetchCurrentChan(context: any) {
      const cur = localStorage.getItem("currentChanName");
      await axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + `/chat/current_chan/${cur}`, {
          params: { chan_name: cur },
        })
        .then((resp: AxiosResponse) => {
          context.commit("setCurrentChannel", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching current channel:", error);
        });
    },
    async fetchMyFriends(context: any) {
      await axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + "/users/my/friends")
        .then((resp: AxiosResponse) => {
          context.commit("setMyFriends", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching my friends:", error);
        });
    },
    async fetchMyBlocked(context: any) {
      await axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + "/users/my/blocked")
        .then((resp: AxiosResponse) => {
          context.commit("setMyBlocked", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching my blocked:", error);
        });
    },
    async fetchAchievements(context: any) {
      return axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + "/users/achievements")
        .then((resp: AxiosResponse) => {
          context.commit("setAchievements", resp.data);
          //   console.log("achievements: ", store.getters.getAchievements);
        })
        .catch((error) => {
          console.error("Error fetching achievements", error);
        });
    },
    async fetchMatches(context: any) {
      await axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + "/matches/my/matches")
        .then((resp: AxiosResponse) => {
          context.commit("setMatches", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching matches", error);
        });
      //   console.log("matches: ", store.getters.getMatches);
    },
    // async fetchWins(context: any) {
    // 	await axiosInstance
    // }

    async fetchFriendChan(context: any) {
      const cur = localStorage.getItem("currentFriend");
      await axiosInstance
        .get(process.env.VUE_APP_BACKEND_URL + `/chat/current_frndchan/${cur}`)
        .then((resp: AxiosResponse<IChannel[]>) => {
          //   console.log("the resp data in ffc: ", resp.data);
          context.commit("setCurrentFriend", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching current channel:", error);
        });
    },
    async disabl2FA(context: any) {
      try {
        const response = await axiosInstance.get(
          process.env.VUE_APP_BACKEND_URL + "/auth/2fa/disable",
        );
        localStorage.setItem("Is2FAEnabled", "false");
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async TwoFA(context: any) {
      try {
        const response = await axiosInstance.get(
          process.env.VUE_APP_BACKEND_URL + "/auth/2fa/generate",
        );
        // console.log("response 2fa: ", response.data);
        // console.log(response.data.qrCodeDataURL);
        localStorage.setItem("qr", response.data.qrCodeDataURL);
      } catch (error) {
        // Handle errors here

        console.error("Error:", error);
      }
    },
    async ValidateTwoFA(context: any) {
      const code = localStorage.getItem("2FACode");
      //   console.log("reached the store to send verification store");
      try {
        const response = await axiosInstance.get(
          process.env.VUE_APP_BACKEND_URL + `/auth/2fa/authenticate/${code}`,
        );
        if (response.data) {
          localStorage.setItem("Is2FAEnabled", "false");
          localStorage.setItem("Is2FAVerified", "true");
          router.push("/home");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async enabl2FA(context: any) {
      try {
        const response = await axiosInstance.get(
          process.env.VUE_APP_BACKEND_URL + "/auth/2fa/enable",
        );
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode<jwtDecoded>(token);
            localStorage.setItem(
              "Is2FAEnabled",
              decoded.Is2FAEnabled.toString(),
            );
          } catch (error) {
            console.error("Error:", error);
          }
          //   router.push("/home");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
  modules: {
    // allow you to organize your store into separate namespaces.
  },
});

export default store;
