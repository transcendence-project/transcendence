<template>
  <div class="a-container">
    <button type="button" id="42" class="btn" @click="login42">
      login (42)
    </button>
  </div>
</template>

<script lang="ts">
import LoginPage from "@/views/LoginPage.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import router from "../../router/index";
import store from "../../store/index";
export default {
  setup() {
    // onMounted(async () => {
    //   try {
    //     await store.dispatch("fetchUserData");
    //   } catch (err) {
    //     console.log(err);
    //     localStorage.clear();
    //     await axios.get("http://localhost:3000/auth/logout", {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     });
    //     router.push("/");
    //   }
    // });
  },
  methods: {
    async login42() {
    //   console.log("Button Clickedd");
		console.log('the backned url is: ', process.env.VUE_APP_BACKEND_URL)
      window.location.href = process.env.VUE_APP_BACKEND_URL + "/auth/42";
    },
  },
};
</script>

<style scoped>
.btn {
  top: 70%;
  left: 50%;
  width: 200px;
  height: 50px;
  transform: translate(-50%, -50%) perspective(500px) rotateY(-15deg) !important;
  text-align: center;
  font-size: 20px;
  background: linear-gradient(90deg, #f39f5a, #ae445a, #451952);
  text-shadow: 6px 3px 2px rgba(0, 0, 0, 0.2);
  color: #fff;
  text-decoration: none;
  border-radius: 25px !important;
  border: none !important;
  letter-spacing: 1px;
  transition: 0.5s;
  overflow: hidden;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.2);
}

button:hover {
  transform: translate(-50%, -50%) perspective(500px) !important;
  text-shadow: -6px 3px 2px rgba(0, 0, 0, 0.2) !important;
}

button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: #451952;
  transition: 0.5s;
}

button:hover::before {
  left: 100%;
}

.a-container {
  position: absolute;
  top: 75%;
  /* Adjust the top value to your preference */
  left: 55%;
  transform: translate(-50%, -50%);
  display: flex;
  margin-top: 25px;
  flex-direction: column;
  align-items: center;
}

.a-container button {
  margin-top: 50px;
  /* Adjust the spacing between the links */
}
</style>
