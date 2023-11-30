<template>
  <div
    class="bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded-md w-full text-white min-h-[85.4vh] md:min-h-[85.10vh] lg:min-h-[85.9vh]"
  >
    <!-- <div> -->

    <div class="pl-0 pt-2.5 pb-2.5 rounded-md relative">
      <input
        v-model="text"
        @input="handleInputChange"
        @focus="showDropdown"
        @blur="hideDropdown"
        placeholder="Search User"
        class="w-[50vw] h-[2rem] px-4 rounded-full focus:border-0 focus:outline-none text-black"
      />
    </div>
    <div v-if="filteredStudents.length > 0">
      <ul
        class="flex flex-col justify-center m-0 p-0 w-[80vw] rounded-md absolute"
      >
        <li
          v-for="item in filteredStudents"
          :key="item.id"
          class="list-none w-[90vw] rounded-lg p-0 m-0"
        >
          <div
            v-if="item.userName !== username"
            class="flex justify-between w-[50vw] bg-[#ae4188] m-1 pt-1 md:pt-0 pb-1 md:pb-0 pr-6 pl-2 flex-col md:flex-row rounded-sm"
          >
            <div class="flex justify-start m-1">
              <div class="w-[8vw]">
                {{ item.userName }}
              </div>
              <div>
                <img
                  :src="item.image"
                  class="mx-2 rounded-full object-cover w-8 h-8"
                />
              </div>
            </div>

            <div class="flex justify-end m-1">
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

    <div>
      <h2 class="text-xl m-3">Friend Requests</h2>
      <p class="text-lg text-green-500 m-2">
        You have {{ requestNumber }} friend request
      </p>
      <ul>
        <li
          v-for="request in friendRequests"
          :key="request.id"
          class="list-none p-0 m-0 mb-2"
        >
          <div
            class="flex items-center justify-between bg-[#AE445A] m-0 pt-3 md:pt-0 pb-3 md:pb-0 pr-6 pl-2 flex-col md:flex-row rounded-sm"
          >
            <div class="flex justify-between mx-4 my-2">
              <div class="w-[40vw]">
                {{ request.sender.fullname }}
              </div>
            </div>
            <div class="flex justify-between">
              <button class="frd-btn" @click="acceptFriendRequest(request.id)">
                Accept
              </button>
              <button class="frd-btn" @click="rejectFriendRequest(request.id)">
                Reject
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div>
      <h2 class="text-xl m-3">My Friends</h2>
      <p class="text-lg text-green-500 m-2">
        You have {{ friendsNumber }} friends
      </p>
      <ul>
        <li
          v-for="friend in myFriendsList"
          :key="friend.id"
          class="list-none p-0 m-0 mb-2"
        >
          <div
            class="flex items-center justify-between bg-[#AE445A] m-0 pt-3 md:pt-0 pb-3 md:pb-0 pr-6 pl-2 flex-col md:flex-row rounded-sm"
          >
            <div class="flex justify-between mx-4 my-2">
              <div class="w-[40vw]">
                {{ friend.fullname }}
              </div>
            </div>
            <div class="flex justify-between">
              <button class="frd-btn" @click="removeFriend(friend.id)">
                Remove
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import OptionMenu from "@/components/OptionMenu.vue";
import StatusUser from "@/components/StatusUser.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import axios, { AxiosResponse } from "axios";
import { IStudent } from "@/models/student";
import { IFriend } from "@/models/friend";

import { computed } from "vue";
import store from "@/store";


// import { mapState, mapActions } from 'vuex';



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
      requestNumber: Number,
      friendsNumber: Number,
      myFriendsList: [] as IFriend[],
      friendName: String,
      selectedUser: null,
      student: [] as IStudent[],
      isDropdownVisible: true,
      friendRequests: [] as IFriend[],
    };
  },



//   computed: {
//     ...mapState(['friendsNumber', 'myFriendsList']),
//   },
//   methods: {
//     ...mapActions(['fetchMyFriends']),
//     // You can call fetchMyFriends in your component
//     // and access friendsNumber and myFriendsList from the store
//   },
//   async created() {
//     await this.Friends();
//   },





  setup() {
    const username = computed(() => store.getters.getUserName);

    onMounted(() => {
      store.dispatch("fetchUserData");
    });

    return {
      username,
    };
  },
  computed: {
	// ...mapState(['friendsNumber', 'myFriendsList']),

    filteredStudents(): any {
      if (this.text.trim() === "") {
        return [];
      }
      return this.student.filter((item: any) => item.userName.toLowerCase().includes(this.text.toLowerCase()) || item.fullname.toLowerCase().includes(this.text.toLowerCase())
      );
    },
  },

  methods: {

	// ...mapActions(['Friends']),

    selectItem(item: any) {
      this.text = "";
      this.hideDropdown();
    },
    showDropdown() {
      this.isDropdownVisible = true;
    },
    hideDropdown() {
      setTimeout(() => {
        this.isDropdownVisible = false;
      }, 200);
    },
    async sendFriendRequest(selectedUser: any) {
      try {
        const response = await axios.post(
          `http://localhost:3000/friend-requests/${selectedUser.id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      } catch (error) {
		  console.log("Error", error);
	  }
    },
    async removeFriend(selectedUser: number) {
      console.log("in remove friend: ", selectedUser);
      try {
        const response = await axios.delete(
          `http://localhost:3000/users/my/friends/${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      } catch (error) {
        console.log("Error", error);
      }
    },



    async myFriends() {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/my/friends`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        this.friendsNumber = response.data.length;
        this.myFriendsList = response.data;
        console.log("testttttresp", response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    },






    async viewFriendRequest() {
      try {
        const response = await axios.get(
          `http://localhost:3000/friend-requests/my-friend-requests`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        this.requestNumber = response.data.length;
        this.friendRequests = response.data;
        //   console.log(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    },

    async acceptFriendRequest(selectedUser: any) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/friend-requests/accept/${selectedUser}`,
        );

        console.log("Friend request accepted:", response);
      } catch (error) {
        console.error("friend accept Error:", error);
      }
    },
    async rejectFriendRequest(selectedUser: any) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/friend-requests/${selectedUser}/reject`,
        );
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },

  mounted() {
    this.viewFriendRequest();
    this.myFriends();
    axios
      .get("http://localhost:3000/users")
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
.relative {
  position: relative;
}
.flex {
  display: flex;
}
.absolute {
  position: absolute;
}

.justify-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
}

.dropdown li {
  padding: 5px;
  cursor: pointer;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
}

.dropdown li:hover {
  background-color: #e0e0e0;
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
