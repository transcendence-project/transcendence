<template>
  <div class="chn-pass">
    <div class="pass-cont">
    
      <div class="passform">
        <!-- <input v-model="text" placeholder="Password" class="pass" /> -->
        <input placeholder="Password" class="pass" />
          <div class="jn-div">
			<div class="pas-btn">

				<button class="jnbtn" >Join</button>
				<!-- <button class="jnbtn" @click="joinChannel">Join</button> -->
			</div>
			<div class="cls-bt">
				<button class="clsbtn" @click="closeChannelPage">Close</button>
				<!-- <button class="clsbtn">Close</button> -->
			</div>
		</div>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
// import store from "@/store";

export default defineComponent({
  methods: {
    closeChannelPage(): void {
      this.$emit('close');
    },
  },
});

</script>
<style scoped>


.chn-pass {
  position: fixed;

  width: 30%;
  height: 30%;
  /* padding: -50vh; */
  background: rgba(0, 0, 0, 0.8); 
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5%;
  z-index: 999; 
}

.pass-cont {
  padding: 0;
  /* width: 50%; */
  /* height: 50%; */
  margin: 0;
  text-align: center;
}
.passform {
  font-size: 1rem;
  color: black;
  width: 50%;
  height: 2rem;
  border-radius: 5px;
  padding-left: 20px;
  margin-bottom: 3rem;
  margin: 10px;
  border: none;
  text-align: left;
}
.jn-div {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: space-between;
  justify-content: center;
  /* margin-bottom: 5%; */
  padding-top: 2dvh;
   /* background: rgba(0, 0, 0, 0.6);  */
  width: 100%;
  height: 100%;
  border-radius: 1rem;
}

.pass{
	margin: 5%;
	padding: 5%;
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
  background: #697692;
  border: none;
}

.clsbtn:hover,
.jnbtn:hover {
  background: #7c8392;
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
