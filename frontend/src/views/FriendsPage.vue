  
  <template>
	<div
	  class="bg-gradient-to-r from-[#451952] via-[#451952] to-[#ae4188] shadow-custom m-5 p-5 rounded-md w-full text-white min-h-[85.4vh] md:min-h-[85.10vh] lg:min-h-[85.9vh]"
	>
	  <div
		class="flex justify-center pl-0 pt-2.5 pb-2.5 rounded-md m-0 mb-[5px] bg-[#AE445A]"
	  >
		<input
		  v-model="text"
		  placeholder="Search friend"
		  class="w-[60%] h-[2rem] px-4 rounded-full focus:border-0 focus:outline-none text-black"
		/>
	  </div>
	  <div v-if="filteredStudents.length > 0">
		<ul class="m-0 mt-4 p-0 rounded-md">
		  <li v-for="item in filteredStudents" :key="item.id" class="list-none p-0 m-0 mb-2">
			<div
				class="flex items-center justify-between bg-[#AE445A] m-0 pt-3 md:pt-0 pb-3 md:pb-0 pr-6 pl-2 flex-col md:flex-row rounded-sm"
			  >
				<div class="flex justify-between mx-4 my-2">
				  <div class="w-[10vh]">
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
					<ButtonComponent btnContent="Add" @click="sendFriendRequest(item)"/>
				  <ButtonComponent btnContent="Block" />
				</div>
			  </div>
		  </li>
		</ul>
	  </div>

	  <div>
    <h2 class="text-xl m-3">Friend Requests</h2>
    <ul>
      <li v-for="request in friendRequests" :key="request.id" class="list-none p-0 m-0 mb-2">
     


		<div
				class="flex items-center justify-between bg-[#AE445A] m-0 pt-3 md:pt-0 pb-3 md:pb-0 pr-6 pl-2 flex-col md:flex-row rounded-sm"
			  >
				<div class="flex justify-between mx-4 my-2">
				  <div class="w-[10vh]">
					{{ request.sender }} wants to be your friend!
				  </div>
				</div>
				<div class="flex justify-between">
					<button class="frd-btn" >Accept</button>
        			<button class="frd-btn">Reject</button>
				</div>
			  </div>

      </li>
    </ul>
  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import OptionMenu from "@/components/OptionMenu.vue";
  import StatusUser from "@/components/StatusUser.vue";
  import ButtonComponent from "@/components/ButtonComponent.vue";
  import axios, { AxiosResponse } from "axios";
  import { IStudent } from "@/models/student";
  import { IFriend } from "@/models/friend";

  export default defineComponent({
	name: "TopNavBar",
	components: {
	  OptionMenu,
	  StatusUser,
	  ButtonComponent,
	},
	data() {
	  return {
		text: '',
		student: [] as IStudent[],
		friendRequests : [] as IFriend[],

	  };
	},
	computed: {
	  filteredStudents() {
		if (this.text.trim() === '') {
        return [];
      }
		return this.student.filter(item =>
		  item.userName.toLowerCase().includes(this.text.toLowerCase())
		);
	  },
	},



	methods: {
    async sendFriendRequest(selectedUser) {
      try {

        const response = await axios.post(`http://localhost:3000/friend-requests/${selectedUser.id}`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    },

    async viewFriendRequest() {
      try {

        const response = await axios.get(`http://localhost:3000/friend-requests/my-friend-requests`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

		this.friendRequests = response.data;
	} catch (error) {
	  console.error('Error fetching friend requests:', error);
	}
    },
  },


	mounted() {
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