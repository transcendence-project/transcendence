<template>
	<div class="dropdown" ref="dropdown">
	  <img
		class="dropbtn"
		src="@/assets/game.svg"
		alt="Dropdown Button"
		@click="toggleDropdown"
	  />
	  <div
		class="dropdown-content"
		:class="{ active: showDropdown }"
		@click.stop=""
	  >
		<router-link to="/profile" @click.native="closeDropdown">Edit Profile</router-link>
		<router-link to="/twofactor" @click.native="closeDropdown">Two-factor-AUTH</router-link>
		<router-link to="/logout" @click.native="closeDropdown">Logout</router-link>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  
  @Options({
	name: 'DropdownMenu',
  })
  export default class DropdownMenu extends Vue {
	private showDropdown: boolean = false;
  
	private toggleDropdown(): void {
	  this.showDropdown = !this.showDropdown;
  
	  if (this.showDropdown) {
		document.addEventListener('click', this.closeDropdownOnClickOutside);
	  } else {
		document.removeEventListener('click', this.closeDropdownOnClickOutside);
	  }
	}
  
	private closeDropdownOnClickOutside(event: MouseEvent): void {
	  if (this.$refs.dropdown instanceof HTMLElement) {
		if (!this.$refs.dropdown.contains(event.target as Node)) {
		  this.showDropdown = false;
		  document.removeEventListener('click', this.closeDropdownOnClickOutside);
		}
	  }
	}
	
	private closeDropdown(): void {
	  this.showDropdown = false;
	  document.removeEventListener('click', this.closeDropdownOnClickOutside);
	}
  }
  </script>
  
  
  <style scoped>
  .dropbtn {
	cursor: pointer;
	width: 40px;
  }
  
  .dropdown-content {
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
  