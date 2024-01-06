<template>
  <div class="fndlst-chn">
    <div v-if="filteredStudents.length > 0">
      <ul class="m-0 mt-4 p-0 rounded-md">
        <li v-for="item in filteredStudents" :key="item.id" class="list-none">
          <div
            class="flex items-center justify-between bg-[#AE445A] md:pt-0 pb-3 md:pb-0 pr-6 pl-2 flex-col md:flex-row rounded-sm"
          >
            <div class="flex justify-between mx-3">
              <div class="w-[15vw]">
                {{ item.userName }}
              </div>
              <div>
                <img
                  :src="item.image"
                  class="mx-2 rounded-full object-cover w-8 h-8"
                />
              </div>
            </div>
            <div class="flex justify-between">
              <ButtonComponent
                btnContent="Add"
                @click="sendFriendRequest(item)"
              />
              <ButtonComponent btnContent="Block" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>No user Found</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionMenu from "@/components/OptionMenu.vue";
import StatusUser from "@/components/StatusUser.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import axios, { AxiosResponse } from "axios";
import { IStudent } from "@/models/student";

export default defineComponent({
  name: "FriendList",
  components: {
    OptionMenu,
    StatusUser,
    ButtonComponent,
  },
  data() {
    return {
      text: "",
      student: [] as IStudent[],
    };
  },
  computed: {
    filteredStudents(): any {
      if (this.text.trim() === "") {
        return [];
      }
      return this.student.filter((item) =>
        item.username.toLowerCase().includes(this.text.toLowerCase()),
      );
    },
  },
  mounted() {
    axios
      .get(process.env.VUE_APP_BACKEND_URL + "/users",
	  {
		headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
	  })
      .then((resp: AxiosResponse<IStudent[]>) => {
        this.student = resp.data;
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  },
});
</script>
<style scoped>
.fndlst-chn {
  position: absolute;
  top: 30%;
  width: 40%;
  height: 50%;
  border-radius: 2%;
  background: black;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.lst-cont {
  width: 90%;
  height: 90%;
  color: white;
  border-radius: 2%;
  /* padding-left: 20%; */
}
.frd-btn {
  font-size: 0.8rem;
  margin: 3%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: #451952;
  border: none;
}

.frd-btn:hover {
  background: #ae4488;
  color: #d9d9da;
}
</style>
