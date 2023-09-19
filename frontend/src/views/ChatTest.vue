<template>
  <div>
    <h1>{{ greeting }}</h1>
    <div class="chat">
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <div class="chat-input">
        <input
          :value="messageInput"
          @input="messageInput = $event.target.value"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MyComponent",
  data() {
    return {
      greeting: "Hello, Vue 3 with TypeScript",
      messages: [] as string[],
      messageInput: "",
    };
  },
  methods: {
    sendMessage() {
      const message = this.messageInput.trim();
      if (message !== "") {
        this.messages.push(message);
        this.messageInput = "";
      }
    },
  },
});
</script>

<style scoped>
.chat-app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.chat-header {
  text-align: center;
  margin-bottom: 10px;
}

.chat-messages {
  /* display: inline; */
  background: grey;
  border: 1px solid #ccc;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 10px;
  /* max-width: 300px; 
	margin-left: auto; */
}

.message {
  /* display: inline; */
  /* align-items: right; */
  justify-content: right;
  background: #f0f0f0;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}
.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 5px;
}

.chat-input button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
}
</style>