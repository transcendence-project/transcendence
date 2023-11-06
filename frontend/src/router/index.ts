import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from '@/store';


const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "login", 
    component: () => import(/* webpackChunkName: "login" */ "../views/LoginPage.vue"),
	meta:{
		allowAnonymous: true
	}
  },

  {
    path: "/",
    name: "home",
	alias: '/home',
    component: () => import(/* webpackChunkName: "home" */ "../views/HomePage.vue"),

  },
  {
    path: "/game",
    name: "game",
    component: () => import(/* webpackChunkName: "game" */ "../views/GamePage.vue"),
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import(/* webpackChunkName: "game" */ "../views/FriendsPage.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: "game" */ "../views/EditProfilePage.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import(/* webpackChunkName: "chat" */ "../views/ChatPage.vue"),
  },
  {
    path: "/leader",
    name: "leader",
    component: () => import(/* webpackChunkName: "leader" */ "../views/LeaderPage.vue"),
  },
  {
    path: "/student",
    name: "student",
    component: () => import(/* webpackChunkName: "student" */ "../views/StudentPage.vue"),
  },
  {
    path: "/twofactor",
    name: "twofactor",
    component: () => import(/* webpackChunkName: "twofactor" */ "../views/TwoFactorAuth.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "notfound" */ "../views/NotFound.vue"),
  },
];

const router = createRouter({
<<<<<<< HEAD
  history: createWebHistory(process.env.BASE_URL),
=======
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory('/'),
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
  routes,


scrollBehavior (to, from , savedPosition){
	return savedPosition || { top: 0}
}
});

<<<<<<< HEAD


=======
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
		  store.dispatch('fetchUserData');
    }
  });
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
export default router;
