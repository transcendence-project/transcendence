<template>
  <div class="channel">
    <div class="edit-cont" >
      <h2 class="adchn">Add Channel</h2>
      <div class="editform">
        <input
          v-model="text"
          placeholder="Channel name"
          class="input text-left"
        />
        <input v-model="text" placeholder="Password" class="input text-left" />
      <h2 class="adchn">Create Channel</h2>
      <div class="editform">
        <input
          v-model="channel_name"
          placeholder="Channel name"
          class="input text-left"
        />
        <input v-model="password" placeholder="Password" class="input text-left" />
        <div class="psopt">
          <p>* password is optional</p>
        </div>
        <div class="add-close">
          <div class="close">
            <button class="closebtn" @click="closePage">Close</button>
          </div>
          <div class="add">
            <button class="addbtn" @click="addchn">Add</button>
=======
            <button class="addbtn" @click="create_room">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
import { defineComponent } from 'vue';

export default defineComponent({
=======
import { defineComponent, ref } from 'vue';
import store from "@/store";

export default defineComponent({
	data() {
    return {
      channel_name: '',
      password: '',
    };
  },
>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
  methods: {
    closePage(): void {
      this.$emit('close');
    },
<<<<<<< HEAD
  },
});
=======
	create_room(){
		// console.log(this.channel_name);
		// console.log(this.password);
		if (store.state.chat.socket)
			store.state.chat.socket.emit( 'create_room', {channel_name: this.channel_name, password: this.password});
	},
  },
});

>>>>>>> efb9a2fd24a901613556d0555207f160bd53347e
</script>

<style scoped>


.channel {
  position: fixed;

  width: 50%;
  height: 40%;
  padding: 10%;
  background: rgba(0, 0, 0, 0.6); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; 
}
.adchn {
  font-size: 1.5rem;
}
.edit-cont {
  padding: 0;
  width: 100%;
  margin: 0;
  text-align: center;
}
.editform {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  justify-content: center;
  background: #ae445a;
  width: 100%;
  border-radius: 1rem;
}

.input {
  font-size: 1rem;
  color: black;
  width: 50%;
  height: 2rem;
  border-radius: 5px;
  padding-left: 20px;
  /* margin-bottom: 3rem; */
  margin: 10px;
  border: none;
  text-align: left;
}
.input:focus {
  border: none;
  outline: none;
}

.add-close {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  padding: 10px;
}

.psopt {
  font-size: small;
  display: flex;
  padding-left: 5px;
  margin-bottom: 20px;
  align-items: right;
  justify-content: right;
  color: rgb(42, 42, 42);
}
.clr {
  color: #ae445a;
}
.upbtn,
.addbtn,
.closebtn {
  font-size: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: #697692;
  border: none;
}
.upbtn:hover,
.addbtn:hover,
.closebtn:hover {
  background: #7c8392;
  color: #d9d9da;
}

input[type="file"]::file-selector-button {
  margin-right: 10px;
  border: none;
  background: #697692;
  font-size: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #7c8392;
}

@media screen and (max-width: 768px) {
  .channel {
    width: 90%; 
    height: 50%; 
    padding: 5%; 
  }
}

.adchn {
  font-size: 1.5rem;
}
@media screen and (max-width: 768px) {
  .editform {
    width: 100%;
  }

  .add-close {
    gap: 20px;
  }
}
</style>
