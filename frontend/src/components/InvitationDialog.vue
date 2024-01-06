<template>
    <Dialog v-model:visible="invitationData.isVisible" header="Game Invitation" class="dialog-container" @hide="handleDialogClose">
        <p>You have been invited to a game by {{ invitationData.inviterName }}.</p>
        <template #footer>
        <Button class="dialog-button" label="Accept" @click="acceptInvitation" />
        <!-- <Button class="dialog-button" label="Reject" @click="rejectInvitation" /> -->
        </template>
    </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const invitationData = computed(() => store.state.invitation);

const acceptInvitation = () => {
  // Handle invitation acceptance
  store.dispatch('closeInvitation');
};

const handleDialogClose = () => {
  store.dispatch('closeInvitation');
};
</script>

<style>
.dialog-container{
  background-color: #451952 !important; /* Set your desired background color */
  padding: 20px; /* Add padding inside the dialog */
  border-radius: 10px; /* Optional: for rounded corners */
}

.dialog-button {
  margin: 10px; /* Margin around buttons */
  /* Further button styling */
}
</style>