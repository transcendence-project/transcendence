<template>
	<div class="dropdown" ref="dropdown">
	  <img
		class="cursor-pointer w-10"
		src="@/assets/game.svg"
		alt="Dropdown Button"
		@click="toggleDropdown"
	  />
	  <div
		class="dropdown-content hidden absolute"
		:class="{ active: showDropdown }"
		@click.stop=""
	  >
		<router-link to="/profile" @click.native="closeDropdown">Edit Profile</router-link>
		<router-link to="/twofactor" @click.native="closeDropdown" @click="two_fa">Two-factor-AUTH</router-link>
		<router-link to="/login" @click.native="closeDropdown">Logout</router-link>
	  </div>
	</div>
</template>

<!----------------------------------------------------- TypeScript code ---------------------------------------------------------------------------------->
<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import store from '@/store';

	const showDropdown = ref(false);
	const dropdownRef = ref<HTMLElement | null>(null); // Define the type of dropdownRef

	const toggleDropdown = () => {
	showDropdown.value = !showDropdown.value;
	};

	const closeDropdownOnClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value?.contains(event.target as Node)) { // Use optional chaining
		showDropdown.value = false;
		document.removeEventListener('click', closeDropdownOnClickOutside);
	}
	};

	const closeDropdown = () => {
	showDropdown.value = false;
	document.removeEventListener('click', closeDropdownOnClickOutside);
	};

	const two_fa = async () => {
		console.log("inside 2 FA function ");
		await store.dispatch("TwoFA")
	};

	onMounted(() => {
	document.addEventListener('click', closeDropdownOnClickOutside);
	});

	onBeforeUnmount(() => {
	document.removeEventListener('click', closeDropdownOnClickOutside);
	});
</script>  

<!----------------------------------------------- CSS ------------------------------------------------------->
<style scoped>
  .dropdown-content {
	/* display: none; */
	/* position: absolute; */
	background-color: #f9f9f9;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	right: 100%;
	margin-right: px;
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
  </style>
  