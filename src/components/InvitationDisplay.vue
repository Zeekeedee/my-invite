<template>
  <div class="invitation" v-if="invitation">
    <!-- Content Overlay -->
    <div class="invitation__content">
      <!-- Pixel border SVG (decorative) -->
      <svg class="invitation__pixel-border" aria-hidden="true" role="presentation" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="4" shape-rendering="crispEdges" stroke-linejoin="miter" />
      </svg>
      <!-- Content Box -->
        <div class="invitation__box invitation__box--pixel">
        <!-- Optional Image -->
        <img
          v-if="invitation.imageUrl && !imageError"
          :src="invitation.imageUrl"
          :alt="`Image for ${invitation.recipientName}`"
          class="invitation__image"
          @error="handleImageError"
        />

        <!-- Recipient Name -->
        <h1 class="invitation__title">
          Hi {{ invitation.recipientName }}! Will you be my Valentine? (˶ᵔ ᵕ ᵔ˶)
        </h1>

        <!-- Sender Name -->
        <p class="invitation__author">
          — from {{ invitation.senderName }} with love
        </p>

        <!-- Expiration Notice (if close to expiring) -->
        <p v-if="expiresIn && expiresIn < 86400 * 3" class="invitation__expiry-notice">
          ⏰ This invitation expires in {{ formatExpiryTime() }}
        </p>

        <!-- Response Buttons -->
        <YesNoButtons
          v-if="invitation"
          :invitation-id="invitation.id"
          :recipient-name="invitation.recipientName"
        />
      </div>
    </div>
  </div>

  <!-- Error States -->
  <div v-else-if="isExpired" class="invitation invitation--expired">
    <div class="invitation__error-box">
      <h2 class="invitation__error-title">Oh no! 😢</h2>
      <p class="invitation__error-message">
        This invitation has expired and is no longer valid.
      </p>
      <p class="invitation__error-hint">
        Please ask {{ senderNameFromError }} to send you a new one!
      </p>
    </div>
  </div>

  <div v-else-if="isInvalid" class="invitation invitation--invalid">
    <div class="invitation__error-box">
      <h2 class="invitation__error-title">Invalid Invitation 🤔</h2>
      <p class="invitation__error-message">
        We couldn't decode this invitation. It may be corrupted or malformed.
      </p>
      <p class="invitation__error-hint">
        Please check the link and try again, or ask the sender to resend it.
      </p>
    </div>
  </div>

  <div v-else-if="isLoading" class="invitation invitation--loading">
    <div class="invitation__loader">
      <div class="loader"></div>
      <p>Loading your invitation...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUrlParam } from '../utils/urlParser'
import { decodeInvitation, isInvitationExpired } from '../utils/dataEncoder'
import YesNoButtons from './YesNoButtons.vue'

// State
const invitation = ref(null)
const isLoading = ref(true)
const isInvalid = ref(false)
const isExpired = ref(false)
// GIF handling removed; background provided by CSS hearts pattern
const imageError = ref(false)
const expiresIn = ref(null)
const senderNameFromError = ref('the sender')

// Computed properties
const hasExpiry = computed(() => {
  return invitation.value && invitation.value.expiresAt
})

/**
 * Format remaining expiration time
 */
function formatExpiryTime() {
  if (!expiresIn.value) return ''
  
  const hours = Math.floor(expiresIn.value / 3600)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else {
    const minutes = Math.floor(expiresIn.value / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
}

/**
 * Load and decode invitation from URL
 */
function loadInvitation() {
  isLoading.value = true
  
  try {
    const encodedId = getUrlParam('id')
    
    if (!encodedId) {
      isInvalid.value = true
      isLoading.value = false
      return
    }

    // Decode invitation
    const decodedInvitation = decodeInvitation(encodedId)
    
    if (!decodedInvitation) {
      isInvalid.value = true
      isLoading.value = false
      return
    }

    // Check if expired
    if (isInvitationExpired(decodedInvitation)) {
      isExpired.value = true
      senderNameFromError.value = decodedInvitation.senderName || 'the sender'
      isLoading.value = false
      return
    }

    // Calculate time remaining (in seconds)
    expiresIn.value = Math.floor((new Date(decodedInvitation.expiresAt).getTime() - Date.now()) / 1000)

    // Update expiry text every minute
    const expiryInterval = setInterval(() => {
      expiresIn.value -= 60
      if (expiresIn.value <= 0) {
        clearInterval(expiryInterval)
        isExpired.value = true
      }
    }, 60000)

    invitation.value = decodedInvitation
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load invitation:', error)
    isInvalid.value = true
    isLoading.value = false
  }
}


/**
 * Handle image load error
 */
function handleImageError() {
  imageError.value = true
}

// Load invitation on mount
onMounted(() => {
  loadInvitation()
})
</script>

<style scoped>
@import '../styles/invitation.bemit.css';
</style>
