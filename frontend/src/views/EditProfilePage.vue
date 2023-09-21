<template>
  <div class="profile">
    <div class="edit-cont">
      <h2>Edit Profile</h2>
      <div class="editform">
        <input v-model="text" placeholder="New username" class="input" />
        <div class="upload">
          <input type="file" @change="uploadFile" ref="file" />
        </div>
        <div class="acc-dec">
          <div class="accept">
            <button class="accbtn" @click="submitFile">Accept</button>
          </div>
          <div class="decline">
            <button class="resbtn" @click="resetForm">Reset</button>
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
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput.files) {
        Images.value = fileInput.files[0];
      }
    };

    const submitFile = async () => {
      if (Images.value) {
        const formData = new FormData();
        formData.append("file", Images.value);
        formData.append("username", text.value);
        const headers = { "Content-Type": "multipart/form-data" };

        try {
          const response = await axios.post(
            "https://httpbin.org/post",
            formData,
            { headers }
          );
          const binaryRepresentation = response.data.files;
          const httpStatus = response.status;
          console.log(binaryRepresentation, httpStatus);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };

    const resetForm = () => {
      Images.value = null;
      text.value = "";
      const fileInput = document.querySelector(
        'input[type="file"]'
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
  background: #24272c;
  margin: 20px;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
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
  background: #34373d;
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
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 20px;
  cursor: pointer;
  color: white;
  background: #697692;
  border: none;
}
.upbtn:hover,
.accbtn:hover,
.resbtn:hover {
  background: #7c8392;
  color: #d9d9da;
}

input[type="file"]::file-selector-button {
  margin-right: 10px;
  border: none;
  background: #697692;
  font-size: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #7c8392;
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
