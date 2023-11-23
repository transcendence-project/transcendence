<template>
  <!-- <div class="dropdown" ref="dropdown"> -->
	<div class="dropdown" ref="dropdown" :ref="dropdownRef">

    <img
      class="cursor-pointer w-10"
      src="@/assets/game.svg"
      alt="Dropdown Button"
      @click="toggleDropdown"
    />
    <div
      class="dropdown-content"
      :class="{ active: showDropdown }"
      @click.stop=""
    >
      <router-link to="/profile" @click.native="closeDropdown"
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
        <button v-if="showTwoFactorButtons" class="enbtn mx-2 px-2"  @click="disable">
          Disable
        </button>
      </div>
      <router-link to="/" @click.native="logout"
        >Logout</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import store from "@/store";

const showDropdown = ref(false);
const showTwoFactorButtons = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  showTwoFactorButtons.value = false;
};

const toggleTwoFactor = () => {
  showTwoFactorButtons.value = !showTwoFactorButtons.value;
};

const closeDropdownOnClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
    showTwoFactorButtons.value = false;
    document.removeEventListener("click", closeDropdownOnClickOutside);
  }
};


// const closeDropdownOnClickOutside = (event: MouseEvent) => {
//   if (dropdownRef.value?.contains(event.target as Node)) {
//     showDropdown.value = false;
//     showTwoFactorButtons.value = false;
//     document.removeEventListener("click", closeDropdownOnClickOutside);
//   }
// };

const closeDropdown = () => {
  showDropdown.value = false;
  showTwoFactorButtons.value = false;
  document.removeEventListener("click", closeDropdownOnClickOutside);
};

const logout = () => {
	localStorage.removeItem('token');
	closeDropdown();
};

const enable = async () => {
	store.dispatch("enabl2FA");
};

const disable = async () => {
	store.dispatch("disabl2FA");
}

onMounted(() => {
  document.addEventListener("click", closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdownOnClickOutside);
});
</script>

<style scoped>
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  right: 100%;
  margin-right: px;
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
.active {
  display: block;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.show {
  display: block !important;
}
</style>
