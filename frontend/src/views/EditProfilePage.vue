<template>
  <div class="profile">
    <div class="edit-cont">
      <h2>Edit Profile</h2>
      <div class="editform">
        <input
          v-model="text"
          placeholder="New username"
          class="input text-black"
        />
        <div class="upload">
          <input type="file" @change="uploadFile" ref="file" />
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

export default {
  setup() {
    const Images = ref<File | null>(null);
    const text = ref("");

    const uploadFile = () => {
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput.files) {
        Images.value = fileInput.files[0];
      }
    };

    const submitFile = async () => {
      if (Images.value || text.value) {
        const formData = new FormData();
        formData.append("file", Images.value);
        formData.append("username", text.value);
        const headers = { "Content-Type": "multipart/form-data" };

        try {
          const response = await axios.post(
            "https://httpbin.org/post",
            formData,
            { headers },
          );
          const binaryRepresentation = response.data.files;
          const httpStatus = response.status;
          console.log(binaryRepresentation, httpStatus);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      resetForm();
    };

    const resetForm = () => {
      Images.value = null;
      text.value = "";
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    };

    return {
      Images,
      text,
      uploadFile,
      submitFile,
      resetForm,
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
