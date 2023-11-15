<template>
	<div class="dropdownopt" ref="dropdownopt">
	  <img
		class="dropsbtnch"
		src="@/assets/option.svg"
		alt="Dropdownopt Button"
		@click="toggleDropdownopt"
	  />
	  <div
		class="dropdownopt-content"
		:class="{ active: showDropdownopt }"
		@click.stop=""
	  >
		<router-link to="/chat" @click.native="closeDropdownopt" @click="leave_room">Leave channel</router-link>
		<router-link to="/chat" @click.native="closeDropdownopt">View Membmers</router-link>
		<!-- <router-link to="/chat" @click.native="closeDropdownopt">View Membmers</router-link> -->
		<a href="#" @click="showChatPage">Message</a>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import { defineComponent, } from "vue";
  import store from '@/store';
  import ChannelMembers from "@/components/ChannelMembers.vue";

  @Options({
	name: 'DropdownoptComponent',
  })
  export default class DropdownoptComponent extends Vue {
	public showDropdownopt: boolean = false;
  
	public toggleDropdownopt(): void {
	  this.showDropdownopt = !this.showDropdownopt;
  
	  if (this.showDropdownopt) {
		document.addEventListener('click', this.closeDropdownoptOnClickOutside);
	  } else {
		document.removeEventListener('click', this.closeDropdownoptOnClickOutside);
	  }
	}
  
	public closeDropdownoptOnClickOutside(event: MouseEvent): void {
	  if (this.$refs.dropdownopt instanceof HTMLElement &&
		  !this.$refs.dropdownopt.contains(event.target as Node)) {
		this.showDropdownopt = false;
		document.removeEventListener('click', this.closeDropdownoptOnClickOutside);
	  }
	}
	public closeDropdownopt(): void {
	  this.showDropdownopt = false;
	  document.removeEventListener('click', this.closeDropdownoptOnClickOutside);
	}

	public viewMembers(): void {
    // Trigger the method to retrieve channel members in the parent component (ChatPage)
    // this.$emit('view-members', this.channel);
    this.closeDropdownopt();
  }

  leave_room(){
	if (store.state.chat.socket){
		store.state.chat.socket.emit('leave_chan', localStorage.getItem('chan_to_leave'));
		}
  	}
}
  </script>
  
  <style scoped>
	.dropsbtnch {
		cursor: pointer;
		width: 40px;
	}
  
  .dropdownopt-content {
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
  
  .dropdownopt-content a {
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
  }
  
  .dropdownopt-content a:hover {
	background-color: #f1f1f1;
  }
  </style>
  