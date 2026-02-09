<template>
  <div class="view-page">
    <InvitationDisplay :invitation-id="invitationId" />
  </div>
</template>

<script setup>
import InvitationDisplay from '../components/InvitationDisplay.vue'

defineProps({
  invitationId: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.view-page {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}
</style>
