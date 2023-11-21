<template>
	<div class="fact">
	  <h2 class="two">Two Factor Authentication</h2>
	  <div class="not-msg flex flex-col align-center my-5">
		<div class="flex align-center">
		  <button class="twobtn p-3 mx-2">Enable</button>
		  <button class="twobtn p-3 mx-2">Disable</button>
		</div>
		<div class="flex align-center m-3 p-2 w-[60%] h-[60%] bg-white">
			<img v-if="qrcode" :src="qrcode" alt="QR Code" />
     	</div>
		<div class="authform flex align-center m-2">
		  <input  placeholder="Verification code" class="px-2 m-3 text-black" />
		  <div class="aut-div">
		</div>
		<div class="flex align-center aut-btn">
		  <button class="autbtn my-2 mx-2 px-3">Add</button>
		</div>
		</div>
	  </div>
	</div>
  </template>
  
  
  
  <script lang="ts" setup>
  import { ref, onMounted , getCurrentInstance} from 'vue';
  import store from '@/store';
  
  const qrcode = ref('');
  const factor = ref('');
  

  onMounted(async () => {
	// console.log("localStorage:", localStorage);

  try {
    await store.dispatch("TwoFA");
    const qrCodeUrl = localStorage.getItem("qr");
    // console.log("QR Code URL from localStorage:", qrCodeUrl);
    qrcode.value = qrCodeUrl;
    // console.log("QR Code:", qrcode.value);
	// console.log("QR Code Type:", typeof qrcode.value);
	const instance = getCurrentInstance();
	instance?.update();

  } catch (error) {
    console.error("An error occurred during setup:", error);
  }
});

  
  </script>
  
  
  


  <style scoped>
  .fact {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(to right, #451952, #451952, #ae4188);
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
	margin: 20px;
	padding: 20px;
	border-radius: 5px;
	width: 100%;
	height: 100%;
	color: white;
  }
  
  .std-msg {
	padding: 0;
	width: 100%;
	margin: 0;
	text-align: center;
  }
  
  .two {
	font-size: 2rem;
	font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
	font-style: Bold;
  }
  
  .aut-div {
	display: flex;
	align-items: center;
	justify-content: space-between;
	justify-content: center;
  
	width: 100%;
	height: 100%;
	border-radius: 1%;
  }
  .autbtn,
  .twobtn {
	  font-size: 0.9rem;
	  color: white;
	  padding-top: 0.6rem;
	  padding-bottom: 0.6rem;
	  background: #ae4488;
	  border-radius: 5px;
	  margin-left: 10px;
	  cursor: pointer;
	  color: white;
  
	  border: none;
  }
  .flex-center {
	display: flex;
	justify-content: center;
	align-items: center;
  }
  
  .center-div {
	margin: 0 auto;
  }
  
  .chn-head {
	  font-size: 1.2rem;
	  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
	  font-style: initial;
  }
  
  
  
  .autbtn:hover,
  .twobtn:hover
   {
	  background: #dd8bf6;
	  color: #d9d9da;
  }
  
  @media screen and (max-width: 768px) {
	.std-title,
	.std-list {
	  flex-direction: column;
	}
  }
  </style>
  