<template>
  <div class="flex flex-col items-center bg-[#24272c] m-5 p-5 rounded-md w-full text-white">
    <div class="p-0 w-full text-center flex flex-col justify-center items-center">
      <h2 class="text-3xl font-bold">Edit Profile</h2>
      <div class="flex flex-col items-center justify-center bg-[#34373d] w-[90%] rounded-xl mt-20">
        <input v-model="text" placeholder="New username" class="text-lg text-center w-[200px] h-[2rem] rounded-[1rem] my-8 border-none focus:border-none focus:outline-none" />
        <div class="flex items-center justify-center mb-6">
          <input type="file" @change="uploadFile" ref="file" />
        </div>
        <div class="acc-dec">
          <div class="accept">
            <ButtonComponent btnContent="Accept" class="text-base"/>
          </div>
          <div class="decline">
           <ButtonComponent btnContent="Reset" class="text-base"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import ButtonComponent from "@/components/ButtonComponent.vue";

const Images = ref<File | null>(null);
const text = ref("");

const uploadFile = () => {  
  const fileInput = document.querySelector(
    'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput.files) {
      Images.value = fileInput.files[0];
    }
}
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
