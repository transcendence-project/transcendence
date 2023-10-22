<template>
	<div class="dropdowns" ref="dropdowns">
	  <img
		class="dropsbtn"
		src="@/assets/option.svg"
		alt="Dropdowns Button"
		@click="toggleDropdowns"
	  />
	  <div
		class="dropdowns-content"
		:class="{ active: showDropdowns }"
		@click.stop=""
	  >
		<router-link to="/chat">Message</router-link>
		<router-link to="/game">Remove</router-link>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  
  @Options({
	name: 'DropdownsComponent',
  })
  export default class DropdownsComponent extends Vue {
	private showDropdowns: boolean = false;
  
	private toggleDropdowns(): void {
	  this.showDropdowns = !this.showDropdowns;
  
	  if (this.showDropdowns) {
		document.addEventListener('click', this.closeDropdownsOnClickOutside);
	  } else {
		document.removeEventListener('click', this.closeDropdownsOnClickOutside);
	  }
	}
  
	private closeDropdownsOnClickOutside(event: MouseEvent): void {
	  if (this.$refs.dropdowns instanceof HTMLElement &&
		  !this.$refs.dropdowns.contains(event.target as Node)) {
		this.showDropdowns = false;
		document.removeEventListener('click', this.closeDropdownsOnClickOutside);
	  }
	}
  }
  </script>
  
  <style scoped>
  .dropsbtn {
	cursor: pointer;
	width: 40px;
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
  
  .dropdowns-content a:hover {
	background-color: #f1f1f1;
  }
  </style>
  