<template>
  <nav class="top-nav-bar">
    <div class="logo"><router-link to="/home">PING PONG</router-link></div>
    <div class="user-menu">
      <div class="user-name">{{ username }}</div>
      <DropdownMenu />
    </div>
  </nav>
</template>

<script>
import DropdownMenu from "./DropdownMenu.vue";

export default {
  name: "TopNavBar",
  components: {
    DropdownMenu,
  },
  data (){
	return {
		username: "yoyohann",
	}
  }
};
</script>
<style scoped>
.top-nav-bar {
  background: #212327;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  width: 70%;
}
a {
  color: white;
  text-decoration: none;
}
img {
  width: 40px;
}
.user-name {
  margin-right: 20px;
}
.user-menu {
  display: flex;
  align-items: center;
}
.usrimg {
  width: 5%;
}
a:hover {
  color: gray;
}
.main-container {
  display: flex;
}
.top-navbar {
  display: flex;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px;
}

.nav-item {
  margin: 0 10px;
  cursor: pointer;
}

.nav-item:hover {
  text-decoration: underline;
}
.dropdown {
  position: relative;
}

.dropdown a {
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
}

.dropdown.active .dropdown-menu {
  display: block;
}

.dropdown-menu li {
  padding: 8px 16px;
  border-top: 1px solid #ccc;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #333;
  display: block;
}

.dropdown-menu li a:hover {
  background-color: #f2f2f2;
}
</style>
