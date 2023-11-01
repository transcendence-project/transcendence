import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login", 
    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/home",
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
    path: "/student",
    name: "student",
    component: () => import("../views/StudentPage.vue"),
  },
];

const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
    if (to.path === '/login') {
    //   document.body.style.backgroundColor = '#F39F5A !important';
    }else {
    //   document.body.style.backgroundColor = '#5E6367';
      console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
    }
    next();
    if (to.path == '/home' && to.query.code)
    {
          const token = to.query.code;
          localStorage.setItem('token', token);
    }
  });
export default router;
