<template>
  <div class="buttons">
    <div v-if="!isResponded" class="buttons__container">
      <!-- "Yes" Button - Always Clickable -->
      <button
        class="buttons__button buttons__button--yes"
        @click="handleYes"
        :disabled="isProcessing"
      >
        {{ isProcessing ? '✨ Recording...' : 'Yes! 🎉' }}
      </button>

      <!-- "No" Button - Playful & Unclickable -->
      <button
        ref="noButtonRef"
        class="buttons__button buttons__button--no"
        @mouseenter="repositionNoButton"
        @touchstart.prevent="repositionNoButton"
        :style="noButtonStyle"
        pointer-events="none"
        disabled
      >
        No 😊
      </button>
    </div>

    <!-- Confirmation Message After Yes -->
    <div v-else class="buttons__confirmation">
      <div class="buttons__confirmation-content">
        <h2 class="buttons__confirmation-title">
          ✨ Yay! {{ recipientName }} is coming! ✨
        </h2>
        <p class="buttons__confirmation-message">
          Thanks for confirming! The celebration begins! 🎊
        </p>
        <div class="confetti confetti-particle" v-for="n in 20" :key="n"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

/**
 * YesNoButtons Component
 * 
 * Interactive response buttons for invitation recipients:
 * - Yes Button: Clickable, records response, triggers celebration
 * - No Button: Playfully repositions on hover, cannot be clicked
 * 
 * Response is persisted to localStorage for tracking
 */

const props = defineProps({
  invitationId: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    default: 'our guest'
  }
})

// State
const isResponded = ref(false)
const isProcessing = ref(false)
const noButtonRef = ref(null)
const noButtonPosition = ref({ x: 0, y: 0 })

// Computed style for no button repositioning
const noButtonStyle = computed(() => ({
  transform: `translate(${noButtonPosition.value.x}px, ${noButtonPosition.value.y}px)`,
  transition: 'transform 0.2s ease-out'
}))

/**
 * Calculate random position for no button
 * Keeps button within viewport bounds with padding
 */
function calculateRandomPosition() {
  const button = noButtonRef.value
  if (!button) return { x: 0, y: 0 }

  const padding = 20
  const rect = button.getBoundingClientRect()
  const buttonWidth = rect.width
  const buttonHeight = rect.height

  // Available space (with padding from edges)
  const maxX = window.innerWidth - buttonWidth - padding
  const maxY = window.innerHeight - buttonHeight - padding

  // Minimum movement distance to make it feel playful (not just tiny movements)
  const minDistance = Math.min(maxX, maxY) * 0.15

  let newX, newY, distance
  
  // Keep generating until we get a movement far enough away
  do {
    newX = Math.max(padding, Math.min(maxX, Math.random() * (maxX - padding)))
    newY = Math.max(padding, Math.min(maxY, Math.random() * (maxY - padding)))
    
    distance = Math.sqrt(
      Math.pow(newX - noButtonPosition.value.x, 2) +
      Math.pow(newY - noButtonPosition.value.y, 2)
    )
  } while (distance < minDistance && maxX > 0 && maxY > 0)

  return { x: newX, y: newY }
}

/**
 * Handle no button mouseenter/touchstart
 * Repositions button away from cursor
 */
function repositionNoButton() {
  // Debounce rapid movements to prevent jank
  if (isProcessing.value || isResponded.value) return

  noButtonPosition.value = calculateRandomPosition()
}

/**
 * Handle yes button click
 * Records response and shows confirmation
 */
async function handleYes() {
  if (isProcessing.value || isResponded.value) return

  isProcessing.value = true

  try {
    // Create response object
    const response = {
      invitationId: props.invitationId,
      recipientName: props.recipientName,
      response: 'yes',
      respondedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    // Store response to localStorage
    const responseKey = `response_${props.invitationId}`
    localStorage.setItem(responseKey, JSON.stringify(response))

    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600))

    isResponded.value = true
    isProcessing.value = false
  } catch (error) {
    console.error('Failed to record response:', error)
    isProcessing.value = false
  }
}

/**
 * Check if response already exists
 * On mount, check localStorage for existing response
 */
function checkExistingResponse() {
  const responseKey = `response_${props.invitationId}`
  const storedResponse = localStorage.getItem(responseKey)

  if (storedResponse) {
    try {
      const response = JSON.parse(storedResponse)
      if (response.response === 'yes') {
        isResponded.value = true
      }
    } catch (error) {
      console.error('Failed to parse stored response:', error)
    }
  }
}

// Initialize on mount
onMounted(() => {
  checkExistingResponse()
  // Initialize no button position (off screen initially)
  noButtonPosition.value = { x: 0, y: 0 }
})
</script>

<style scoped>
@import '../styles/buttons.bemit.css';
</style>
