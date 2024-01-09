<template>
  <div id="home">
    <Toast />
    <!-- <Dialog v-model:visible="invitationModalVisible" header="Game Invitation" class="dialog-container" @hide="handleDialogClose">
        <p>You have been invited to a game by {{ inviterName }}.</p>
        <template #footer>
        <Button class="dialog-button" label="Accept" @click="acceptInvitation" />
        </template>
    </Dialog> -->
    <TopNavBar v-if="!['login','game', 'twofactor'].includes($route.name)" />
    <div class="side-cont">
      <SideNavBar v-if="!['login','game', 'twofactor'].includes($route.name)" />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted } from "vue";
import TopNavBar from "@/components/TopNavBar.vue";
import SideNavBar from "@/components/SideNavBar.vue";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import Button from 'primevue/button';
import { useWebSocket } from "@/plugins/websocket-plugin";


// const { socket} = useWebSocket();

// const invitationModalVisible = ref(false);
// const dialog = ref(false);
// const invitationAccepted = ref(false);
// const inviterName = ref<string | null>(null);

//     const showInvitationModal = (inviter:string) => {
//       inviterName.value = inviter;
//       invitationModalVisible.value = true;
//     };
//     const acceptInvitation = () => {
//         invitationAccepted.value = true;
//       invitationModalVisible.value = false;
//       socket.socket?.emit('response-status', true);
//       console.log("accept ");
//     };
//     const rejectInvitation = () => {
//       invitationModalVisible.value = false;
//       console.log("rejected ")
//       // Handle rejection logic
//     };
//     const handleDialogClose = ()  => {
//         if (!invitationAccepted.value) {
//         // Only reject if the invitation wasn't explicitly accepted
//         console.log("Dialog closed without explicit acceptance, considered as rejection.");
//         rejectInvitation();
//       }
//       // Reset the flag for future invitations
//       invitationAccepted.value = false;
//     };
//     onMounted(() => {
//         console.log("before listen");
//         socket.socket?.on('invite-status', (data: string) => {
//             console.log("here from the frontend invite-status")
//         showInvitationModal(data);
//     });
//     });
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
}
.side-cont {
  display: flex;
}
.prof-cont {
  flex: 1;
  padding: 20px;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}
.slide-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.nav {
  width: 100%;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
