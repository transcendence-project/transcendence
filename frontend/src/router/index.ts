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
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory('/'),
  routes,


scrollBehavior (to, from , savedPosition){
	return savedPosition || { top: 0}
}
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
	if (from.fullPath === '/chat') { // Replace 'chatRoute' with your chat route name
		// Clear the channels array or perform any other necessary cleanup
		store.state.chat.socket.off('create_room_success');
		store.state.chat.socket.off('join_room_success');
		store.state.chat.socket.off('update_chan_list');
		store.state.chat.socket.off('chan_msg_success');
		store.state.chat.socket.off('priv_msg_success');
	  }
    next();
    if (to.path == '/home' && to.query.code)
    {
          const token = to.query.code;
          localStorage.setItem('token', token);
		  store.dispatch('fetchUserData');
    }
  });
export default router;
