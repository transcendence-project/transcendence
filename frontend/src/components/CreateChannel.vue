<template>
  <div class="channel">
    <div class="edit-cont">
      <h2 class="adchn">Create Channel</h2>

      <div class="editform">
        <div>
          <div class="add my-3">
            <button class="sel-chn mx-2 px-2" @click="showInputField(1)">
              Private
            </button>
            <button class="sel-chn mx-2 px-2" @click="showInputField(2)">
              Protected
            </button>
            <button class="sel-chn mx-2 px-2" @click="showInputField(3)">
              Public
            </button>
          </div>
        </div>
        <div class="w-[60%]">
          <div v-if="isprivate">
            <input
              v-model="channel_name"
              placeholder="Private Channel name"
              class="input text-left"
            />
            <input
              v-model="password"
              placeholder="Password"
              class="input text-left"
              type="password"
            />
            <div class="text-center">
              <div class="inline-block">
                <div class="psopt">
                  <p>* password is optional</p>
                </div>

                <div class="add-close mx-5">
                  <div class="close">
                    <button class="closebtn" @click="closePage">Close</button>
                  </div>
                  <div class="add">
                    <button class="addbtn" @click="create_room">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="ispublic">
            <input
              v-model="channel_name"
              placeholder="Public Channel name"
              class="input text-left"
            />

            <div class="text-center">
              <div class="inline-block">
                <div class="add-close">
                  <div class="close">
                    <button class="closebtn" @click="closePage">Close</button>
                  </div>
                  <div class="add">
                    <button class="addbtn" @click="create_room">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="isprotected">
            <input
              v-model="channel_name"
              placeholder="Protected Channel name"
              class="input text-left"
            />
            <input
              v-model="password"
              placeholder="Password"
              class="input text-left"
              type="password"
            />
            <div class="text-center">
              <div class="inline-block">
                <div class="psopt">
                  <p>* password is optional</p>
                </div>
                <div class="add-close">
                  <div class="close">
                    <button class="closebtn" @click="closePage">Close</button>
                  </div>
                  <div class="add">
                    <button class="addbtn" @click="create_room">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import store from "@/store";

export default defineComponent({
  data() {
    return {
      channel_name: "",
      password: "",
      isprivate: false,
      isprotected: false,
      ispublic: false,
    };
  },
  methods: {
    closePage(): void {
      this.$emit("close");
    },
    create_room() {
      // console.log(this.channel_name);
      // console.log(this.password);
      if (store.state.chat.socket) {
        if (this.password)
          store.state.chat.socket.emit("create_prot_room", {
            channel_name: this.channel_name,
            password: this.password,
          });
        else
          store.state.chat.socket.emit("create_pub_room", {
            channel_name: this.channel_name,
            password: this.password,
          });
      }
      this.channel_name = "";
      this.password = "";
    },

    showInputField(num: number) {
      if (num === 1) {
        this.isprivate = true;
        this.ispublic = false;
        this.isprotected = false;
      } else if (num === 2) {
        this.isprotected = true;
        this.isprivate = false;
        this.ispublic = false;
      } else if (num === 3) {
        this.ispublic = true;
        this.isprivate = false;
        this.isprotected = false;
      }
    },
  },
});
</script>

<style scoped>
.channel {
  position: fixed;

  width: 60%;
  height: 40%;
  padding: 5%;
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
  width: 60%;
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
.sel-chn,
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
  background: #451952;
  border: none;
}
.sel-chn:hover,
.upbtn:hover,
.addbtn:hover,
.closebtn:hover {
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

  .add-close {
    gap: 20px;
  }
}
</style>
