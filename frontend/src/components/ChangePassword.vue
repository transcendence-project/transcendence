<template>
  <div class="chn-pass">
    <div class="pass-cont flex flex-col ">
    <p class="text-lg m-4">Change password</p>
      <div class="passform">
        <input v-model="member" placeholder="New Password" class="member rounded-sm p-2 text-black"/>
          <div class="jn-div">
			<div class="pas-btn">

				<button class="jnbtn" @click="add_priv_mem">Update</button>
			</div>
			<div class="cls-bt">
				<button class="clsbtn" @click="closePrivatePage">Close</button>
			</div>
		</div>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import store from "@/store";

export default defineComponent({
	data(){
		return{
			member: '',
		};
	},
  methods: {
    closePrivatePage(): void {
      this.$emit('close');
    },
	add_priv_mem() {
		if (store.state.chat.socket)
        store.state.chat.socket.emit("add_user_to_priv", {
		  user_to_add: this.member,
          room_name: localStorage.getItem('currentChanName'),
        });
	},
  },
});

</script>
<style scoped>


.chn-pass {
  position:absolute;

  width: 40%;
  height: 40%;
  margin-left:10%;
  left: 10%;
  bottom: 10%;
  padding: 3%;
  background: rgba(0, 0, 0, 0.7); 

  border-radius: 1%;
  z-index: 999; 
}


.pass-cont{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  justify-content: center;
  background: #ae445a;
  width: 100%;
  height: 100%;
  border-radius: 1%;
}
.jn-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: center;

  width: 100%;
  height: 100%;
  border-radius: 1%;
}

.pass {
  font-size: 1rem;
  color: black;
  width: 100%;
  height: 2rem;
  border-radius: 5px;
  padding-left: 20px;
  margin: 10px;
  border: none;
  text-align: left;
}
.pass:focus {
  border: none;
  outline: none;
}



.pas-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  padding: 10px;
}

.clr {
  color: #ae445a;
}
.clsbtn,
.jnbtn {
  font-size: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}

.clsbtn:hover,
.jnbtn:hover {

  background: #ae4488;
  color: #d9d9da;
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

  .jn-div {
    gap: 20px;
  }
}
</style>
