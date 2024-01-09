<template>
  <div class="dropdowns" ref="dropdownsRef">
    <img
      class="dropsbtn rounded-full object-cover w-8 h-8"
      :src="userimage"
      alt="Dropdowns Button"
      @click="toggleDropdowns"
    />

    <div
      class="dropdowns-content"
      :class="{ active: showDropdown }"
      @click.stop=""
    >
      <router-link to="/editprofile" @click.native="closeDropdown"
        >Edit Profile</router-link
      >
		<!-- <router-link to="/twofactor" @click.native="toggleTwoFactor">Two-factor-AUTH</router-link> -->
     <router-link to="#" @click.native="toggleTwoFactor"
        >Two-factor-AUTH</router-link
      >
       <div class="flex">
        <button v-if="showTwoFactorButtons" class="enbtn mx-2 px-2" @click="enable">
          Enable
        </button>
        <button
          v-if="showTwoFactorButtons"
          class="enbtn mx-2 px-2"
          @click="disable"
        >
          Disable
        </button>
      </div>
      <router-link to="/" @click.native="logout">Logout</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, getCurrentInstance } from "vue";
import store from "@/store";
import axios from "axios";
import router from "@/router";
import { useWebSocket } from "@/plugins/websocket-plugin";

const { socket } = useWebSocket();
const instance = getCurrentInstance();
const showDropdown = ref(false);
const dropdownsRef = ref<HTMLElement | null>(null);
const showTwoFactorButtons = ref(false);

const toggleTwoFactor = () => {
  showTwoFactorButtons.value = !showTwoFactorButtons.value;
};
const toggleDropdowns = () => {
  showDropdown.value = !showDropdown.value;

  if (showDropdown.value) {
    document.addEventListener("click", closeDropdownOnClickOutside);
  } else {
    document.removeEventListener("click", closeDropdownOnClickOutside);
  }
};

const closeDropdownOnClickOutside = (event: MouseEvent) => {
  if (
    dropdownsRef.value &&
    !dropdownsRef.value.contains(event.target as Node)
  ) {
    showDropdown.value = false;
    document.removeEventListener("click", closeDropdownOnClickOutside);
  }
};

const closeDropdown = () => {
  showDropdown.value = false;
  showTwoFactorButtons.value = false;
  document.removeEventListener("click", closeDropdownOnClickOutside);
};

const logout = () => {
  console.log("logout jwt token: ", localStorage.getItem("token"));
  try {
    const response = axios.get(process.env.VUE_APP_BACKEND_URL + "/auth/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
	localStorage.clear();
    socket.socket?.emit('logout');
	router.push('/login');
  closeDropdown();
  } catch (error) {
    console.log(error);
  }
};

const enable = async () => {
	        instance?.proxy?.$toast.add({
		severity: "success",
		summary: "2FA Enabled",
		detail: `Two-factor authentication has been enabled.`,
		life: 3000,
	});
  store.dispatch("enabl2FA");
};

const disable = async () => {
	instance?.proxy?.$toast.add({
		severity: "success",
		summary: "2FA Disabled",
		detail: `Two-factor authentication has been disabled.`,
		life: 3000,
	});

  store.dispatch("disabl2FA");
};

onMounted(() => {
//   store.dispatch("fetchUserData");
  document.addEventListener("click", closeDropdownOnClickOutside);
});

const userimage = computed(() => store.getters.getImage);
const username = computed(() => store.getters.getUserName);

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdownOnClickOutside);
});
</script>

<style scoped>
.dropsbtn {
  cursor: pointer;
  /* width: 40px; */
}

.dropdowns-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  right: 100%;
  margin-right: px;
}

.active {
  display: block;
}

.dropdowns-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.enbtn {
  font-size: 0.8rem;
  color: white;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  background: #451952;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  color: white;

  border: none;
}
.enbtn:hover {
  background: #ae4488;
  color: #d9d9da;
}
.dropdowns-content a:hover {
  background-color: #f1f1f1;
}
</style>
