<template>
  <div class="create-page">
    <InvitationForm />
  </div>
</template>

<script setup>
import InvitationForm from '../components/InvitationForm.vue'
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7ecec 0%, #fab1a0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
