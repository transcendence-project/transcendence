<!-- ChatMessageField.vue -->

<template>
	<div class="chat-message-field">
	  <div class="messages" ref="messages">
		<!-- Display messages from bottom to top -->
		<div v-for="message in reversedMessages" :key="message.id" class="message">
		  {{ message.text }}
		</div>
	  </div>
	  <div class="input-container">
		<input v-model="newMessage" placeholder="Type your message..." />
		<button @click="sendMessage">Send</button>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		messages: [],
		newMessage: "",
	  };
	},
	computed: {
	  reversedMessages() {
		return this.messages.slice().reverse();
	  },
	},
	methods: {
	  sendMessage() {
		if (this.newMessage.trim() !== "") {
		  this.messages.push({
			id: new Date().getTime(),
			text: this.newMessage.trim(),
		  });
		  this.newMessage = "";
		  this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
		}
	  },
	},
  };
  </script>
  
  <style scoped>
  .chat-message-field {
	width: 300px;
	margin: auto;
	color:black;
  }
  
  .messages {
	height: 300px;
	overflow-y: auto;
	border: 1px solid #ccc;
	padding: 10px;
	color: white;
  }
  
  .message {
	margin-bottom: 10px;
  }
  
  .input-container {
	display: flex;
	margin-top: 10px;
  }
  
  .input-container input {
	flex: 1;
	margin-right: 10px;
  }
  
  .input-container button {
	background-color: #4caf50;
	color: white;
	border: none;
	padding: 10px 15px;
	cursor: pointer;
  }
  </style>
  