import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    alias: "/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginPage.vue"),
    meta: {
      auth: false,
      allowAnonymous: true,
    },
  },

  {
    path: "/",
    name: "home",
    alias: "/home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/HomePage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/users/:username",
    name: "users",
    alias: "/users",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/UserProfile.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/game",
    name: "game",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/GamePage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/friends",
    name: "friends",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/FriendsPage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/editprofile",
    name: "editprofile",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/EditProfilePage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: () =>
      import(/* webpackChunkName: "chat" */ "../views/ChatPage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/leader",
    name: "leader",
    component: () =>
      import(/* webpackChunkName: "leader" */ "../views/LeaderPage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/student",
    name: "student",
    component: () =>
      import(/* webpackChunkName: "student" */ "../views/StudentPage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/twofactor",
    name: "twofactor",
    component: () =>
      import(/* webpackChunkName: "twofactor" */ "../views/TwoFactorAuth.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "notfound" */ "../views/NotFound.vue"),
  },
];

const router = createRouter({
  //   history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory("/"),
  routes,

  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to: any, from: any, next: any) => {
  const isauth = localStorage.getItem("token");
  if (!isauth && to.path != "/login") {
    console.log("isauthhhtesthh: ", isauth);
    // console.log("isauth: ", isauth);
    next("/login");
  }
  //   if (!isauth && to.path != "/") {
  //     console.log("isauthhhhh: ", isauth);
  //     next("/home");
  //   }
  //   if ((to.path === "/home" || to.path === "/twofactor") && to.query.code) {
  //     const token = to.query.code;
  //     localStorage.setItem("token", token);
  //     store.dispatch("fetchUserData");
  //     // console.log("isauth: ", isauth);
  //     // isAuthenticated = true; // Update the authentication status
  //   }
  //   if (to.meta.auth && !isauth) {
  //     next("/");
  //   } else {
  //     next();
  //   }

  //   const isauth = store.getters.getAuthenticated;
  //   console.log("isauth: ", isauth);
  //   const requireAuth = !to.meta.allowAnonymous;
  //   console.log("isauth: ", isauth);
  //   const requireAuth = !to.meta.allowAnonymous;

  //   if (to.meta.auth && !isauth) {
  //     next("/");
  //   }

  if (to.path === "/game") {
    document.body.style.background = "#AE445A";
  } else if (to.path === "/login") {
    document.body.style.background = "#AE445A";
  } else {
    document.body.style.background =
      "linear-gradient(to bottom, #F39F5A, #451952)";
    // console.log("isauth: ", isauth);
    console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
  }
  if (from.fullPath === "/chat" && to.fullPath != "/chat") {
    // Replace 'chatRoute' with your chat route name
    // Clear the channels array or perform any other necessary cleanup
    store.state.chat.socket.off("create_room_success");
    store.state.chat.socket.off("join_room_success");
    store.state.chat.socket.off("update_chan_list");
    store.state.chat.socket.off("chan_msg_success");
    store.state.chat.socket.off("priv_msg_success");
    store.state.chat.socket.off("update_chan_message");
    store.state.chat.socket.off("update_mem_list");
  }
  if (to.path == "/home" && to.query.code) {
    const token = to.query.code;
    localStorage.setItem("token", token);
    store.dispatch("fetchUserData");
  }
  next();
  if (to.path == "/twofactor" && to.query.code) {
    const token = to.query.code;
    localStorage.setItem("token", token);
    store.dispatch("fetchUserData");
  }
});
export default router;
