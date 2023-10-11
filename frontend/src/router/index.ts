import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
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
    path: "/login",
    name: "login",
    component: () => import("../views/LoginPage.vue"),
  },
];

const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  if (to.path === '/login') {
    document.body.style.backgroundColor = '#3A1078';
  }else {
    document.body.style.backgroundColor = '#5E6367';  // Reset to default or another color
	console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
	console.log(`to.path ${to.path}`);
  }
  next();
  if (to.path == '/home' && to.query.code)
  {
		const token = to.query.code;
		// console.log(`token = ${to.query.code}`);
		localStorage.setItem('token', token);
		// console.log(`token from local storage = ${localStorage.getItem('token')}`);
  }
});

export default router;
