import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/game",
    name: "game",
    component: () => import("../views/GamePage.vue"),
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import("../views/FriendsPage.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/EditProfilePage.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/ChatPage.vue"),
  },
  {
    path: "/leader",
    name: "leader",
    component: () => import("../views/LeaderPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    document.body.style.backgroundColor = '#3A1078';
  }
  next();
});

export default router;
