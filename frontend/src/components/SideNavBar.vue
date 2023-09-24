<template>
  <aside class="bg-abd p-5">
    <ul class="side-nav-links list-none p-0">
      <li class="mb-5">
        <router-link to="/chat"
          ><img src="@/assets/chat.svg" alt="Chat" />
        </router-link>
      </li>
      <li class="mb-5">
        <router-link to="/game"
          ><img src="@/assets/game.svg" alt="Game" />
        </router-link>
      </li>
      <li class="mb-5">
        <router-link to="/leader"
          ><img src="@/assets/leader.svg" alt="Leader board"
        /></router-link>
      </li>
      <li>
        <router-link to="/friends"
          ><img src="@/assets/friends.svg" alt="Friends"
        /></router-link>
      </li>
    </ul>
  </aside>
</template>

<!-- <style scoped>
.side-nav-bar {
  background-color: #34373d;
  color: #fff;
  width: 70px;
  height: 100vh;
  padding: 20px;
  margin-left: 0;
}

.side-nav-links {
  list-style: none;
  padding: 0;
}

.side-nav-links li {
  margin-bottom: 15px;
}

.side-nav-links li a {
  color: #fff;  
  text-decoration: none;
}

.side-nav-links li a:hover {
  text-decoration: underline;
}
</style> -->
