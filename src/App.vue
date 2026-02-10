<template>
  <div class="app">
    <!-- Routing Logic: Show CreatePage for new invitations, ViewPage when ?id parameter present -->
    <CreatePage v-if="!invitationId" />
    <ViewPage v-else :invitation-id="invitationId" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import CreatePage from './pages/CreatePage.vue'
import ViewPage from './pages/ViewPage.vue'
import { getUrlParam } from './utils/urlParser'
import './styles/main.css'
import './styles/responsive.bemit.css'
import './styles/animations.css'
import './styles/components.bemit.css'

// Track invitation ID to determine which page to show
const invitationId = ref(null)

// Detect route on component initialization
onBeforeMount(() => {
  detectRoute()
})

// Listen for URL changes (browser back/forward)
onMounted(() => {
  window.addEventListener('popstate', detectRoute)
  return () => {
    window.removeEventListener('popstate', detectRoute)
  }
})

// Route detection: check for ?id parameter in URL
function detectRoute() {
  const id = getUrlParam('id')
  invitationId.value = id || null
}
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>
