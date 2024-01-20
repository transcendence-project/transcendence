<template>
	<div class="profile">
		<div class="edit-cont">
			<h2>Edit Profile</h2>
			<div class="editform">
				<input v-model="username" placeholder="New Fullname" class="input text-black" />
				<div class="acc-dec">
					<div class="decline">
						<button class="resbtn" @click="resetInput">Reset</button>
					</div>
					<div class="accept">
						<button class="accbtn" @click="updateUserName">update</button>
					</div>
				</div>

				<div class="upload">
					<input type="file" @change="uploadFile" ref="fileInput" />
				</div>
				<div class="acc-dec">
					<div class="decline">
						<button class="resbtn" @click="resetForm">Reset</button>
					</div>
					<div class="accept">
						<button class="accbtn" @click="submitFile">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
  
<script lang="ts">
import { ref } from "vue";
import axios from "axios";
import { getCurrentInstance } from "vue";

export default {
	setup() {
		const Images = ref(null);
		const username = ref("");
		const fileInput = ref(null);
		const formData = new FormData();
		const instance = getCurrentInstance();


		const uploadFile = (event: any) => {
			// console.log("uploadFile function called");

			const selectedFile = event.target.files[0];
			if (selectedFile) {
				Images.value = selectedFile;
				// console.log("File selected:", Images.value);
			} else {
				// console.log("No file selected");
			}
		};


		const submitFile = async () => {
			if (Images.value) {
				formData.append("file", Images.value);

				try {
					const profilePicResponse = await axios.patch(
						process.env.VUE_APP_BACKEND_URL + "/users/profile-picture",
						formData,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`,
							},
						}
					);
					// console.log("Profile Picture Response:", profilePicResponse.data);
					const binaryRepresentation = profilePicResponse.data.files;
					const httpStatus = profilePicResponse.status;
					// console.log(binaryRepresentation, httpStatus);
					instance?.proxy?.$toast.add({
						severity: "success",
						summary: "Profile picture updated",
						detail: "Your profile picture has been updated.",
						life: 3000,
					});
				} catch (error: any) {
							instance?.proxy?.$toast.add({
								severity: "error",
								summary: "Error uploading profile picture",
								detail: "There has been an error updating the profile picture. Picture must PNG and less than 5KB",
								life: 3000,
							});
						}
			} else {
					instance?.proxy?.$toast.add({
					severity: "warn",
					summary: "No file selected",
					detail: "Please select a file to upload.",
					life: 3000,
				});
			}

			resetForm();
		};

		const updateUserName = async () => {
			if (username.value.toString().length < 20) {
				formData.append("username", username.value);

				// Log formData to check if username is present
				// console.log("formData before axios call:", formData);

				try {
					const usernameResponse = await axios.post(
						process.env.VUE_APP_BACKEND_URL + `/users/username`,
						{ username: username.value },
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`,
							},
						}
					);

					// console.log("Username Response:", usernameResponse.data);
				} catch (error) {
					console.error("Error updating username:", error);
				} finally {
					// Clear the form data after the update
					formData.delete("userName");
				}
			} else {
				instance?.proxy?.$toast.add({
					severity: "error",
					summary: "Invaild fullName",
					detail: "Full name cannot be longer than 20 characters.",
					life: 3000,
				});
				console.error("Insert a username");
			}

			// Clear the input after the update
			username.value = "";
		};

		const resetForm = () => {
			Images.value = null;
			// username.value = "";
			const fileInput = document.querySelector(
				'input[type="file"]'
			) as HTMLInputElement;
			if (fileInput) {
				fileInput.value = "";
			}

		};
		const resetInput = () => {
			if (username.value) {
				username.value = "";
			}

		};

		return {
			Images,
			username,
			uploadFile,
			submitFile,
			resetForm,
			updateUserName,
			resetInput,
		};
	},
};
</script>


<style scoped>
.profile {
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
	width: 90%;
	border-radius: 1rem;
}

.input {
	font-size: 1rem;
	width: 200px;
	height: 2rem;
	border-radius: 1rem;
	padding-left: 20px;
	margin-bottom: 3rem;
	margin-top: 2rem;
	border: none;
}

.input:focus {
	border: none;
	outline: none;
}

.upload {
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
}

.acc-dec {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 100px;
	padding: 20px;
}

.upbtn,
.accbtn,
.resbtn {
	font-size: 1rem;
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

.upbtn:hover,
.accbtn:hover,
.resbtn:hover {
	background: #ae4488;
	color: #d9d9da;
}

input[type="file"]::file-selector-button {
	font-size: 1rem;
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
	transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
	background: #ae4488;
}

@media screen and (max-width: 768px) {
	.editform {
		width: 100%;
	}

	.acc-dec {
		gap: 20px;
	}
}
</style>