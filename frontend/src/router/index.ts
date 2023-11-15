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
    if(to.path === '/game')
    {
        document.body.style.background = '#AE445A';
    }
    else if (to.path === '/')
    {
        document.body.style.background = '#AE445A';
    }
    else {
        document.body.style.background = 'linear-gradient(to bottom, #F39F5A, #451952)';
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
