<template>
  <div class="buttons">
    <div v-if="!isResponded" class="buttons__container">
      <!-- "Yes" Button - Always Clickable -->
      <button
        ref="yesButtonRef"
        class="buttons__button buttons__button--yes button pixel"
        @click="handleYes"
        :disabled="isProcessing"
      >
        {{ isProcessing ? '✨ Recording...' : 'Yes! ❤︎' }}
      </button>

      <!-- "No" Button - Playful & Unclickable (pointer usable) -->
      <button
        ref="noButtonRef"
        class="buttons__button buttons__button--no button pixel"
        @mouseenter="repositionNoButton"
        @touchstart.prevent="repositionNoButton"
        @focus="announceNoBehavior"
        :style="noButtonStyle"
        aria-describedby="no-hint"
      >
        No (˵ ¬ᴗ¬˵)
      </button>
      <span id="no-hint" class="sr-only" role="status">This button playfully moves away; keyboard users should press Yes to respond.</span>
    </div>

    <!-- Confirmation Message After Yes -->
    <div v-else class="buttons__confirmation">
      <div class="buttons__confirmation-content">
        <h2 class="buttons__confirmation-title">
          ✨ ✧｡◝(ᵔᗜᵔ)◜✧*｡ ✨
        </h2>
        <p class="buttons__confirmation-message">
          Thanks for saying yes, {{ props.recipientName }}! ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
        </p>
        <div class="confetti confetti-particle" v-for="n in 20" :key="n"></div>
      </div>
    </div>

    <!-- Floating Giggle Boxes -->
    <div
      v-for="giggleBox in floatingGiggleBoxes"
      :key="giggleBox.id"
      class="giggle-box"
      :style="{ left: giggleBox.position.x + 'px', top: giggleBox.position.y + 'px' }"
    >
      <img :src="giggleBox.gifUrl" alt="giggle" class="giggle-box__image" />
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
const yesButtonRef = ref(null)
const noButtonRef = ref(null)
const noButtonPosition = ref({ x: 0, y: 0 })
const floatingGiggleBoxes = ref([])
let giggleBoxIdCounter = 0

// Giggle GIF tracking - ensures no repeats until all are used
const availableGiggleGifs = [
  '/gifs/gif.gif',
  '/gifs/Lmao%20Lol%20GIF%20by%20STRAPPED!.gif',
  '/gifs/Mike%20Myers%20Evil%20Laugh%20GIF.gif',
  '/gifs/Nick%20Offerman%20Laughing%20GIF.gif',
  '/gifs/Ryan%20Gosling%20Reaction%20GIF.gif',
  '/gifs/Season%203%20Nbc%20GIF%20by%20The%20Office.gif'
]
const usedGifIndices = ref(new Set())

// Computed style for no button repositioning
const noButtonStyle = computed(() => ({
  transform: `translate(${noButtonPosition.value.x}px, ${noButtonPosition.value.y}px)`,
  transition: 'transform 0.2s ease-out'
}))

/**
 * Calculate random position for no button
 * Keeps button within viewport bounds with padding
 * Calculates translate offsets relative to button's original position
 */
function calculateRandomPosition() {
  const button = noButtonRef.value
  if (!button) return { x: 0, y: 0 }

  const padding = 20
  const rect = button.getBoundingClientRect()
  const buttonWidth = rect.width
  const buttonHeight = rect.height

  // Calculate button's original (untranslated) position
  const originalX = rect.left - noButtonPosition.value.x
  const originalY = rect.top - noButtonPosition.value.y

  // Calculate min/max translate values to keep button in viewport
  const minTranslateX = padding - originalX
  const maxTranslateX = window.innerWidth - buttonWidth - padding - originalX
  
  const minTranslateY = padding - originalY
  const maxTranslateY = window.innerHeight - buttonHeight - padding - originalY

  // Minimum movement distance to make it feel playful (not just tiny movements)
  const minDistance = Math.min(window.innerWidth, window.innerHeight) * 0.15

  let newX, newY, distance
  
  // Keep generating until we get a movement far enough away
  do {
    newX = minTranslateX + Math.random() * (maxTranslateX - minTranslateX)
    newY = minTranslateY + Math.random() * (maxTranslateY - minTranslateY)
    
    distance = Math.sqrt(
      Math.pow(newX - noButtonPosition.value.x, 2) +
      Math.pow(newY - noButtonPosition.value.y, 2)
    )
  } while (distance < minDistance && maxTranslateX > minTranslateX && maxTranslateY > minTranslateY)

  return { x: newX, y: newY }
}

/**
 * Handle no button mouseenter/touchstart
 * Repositions button away from cursor and creates a giggle box
 */
function repositionNoButton() {
  // Debounce rapid movements to prevent jank
  if (isProcessing.value || isResponded.value) return

  noButtonPosition.value = calculateRandomPosition()
  createGiggleBox()
}

/**
 * Get a random URL from available giggle GIFs
 * Ensures no GIF is repeated until the entire batch has been used
 * Future: could be replaced with an API that fetches available GIFs
 */
function getRandomGiggleGif() {
  // If all GIFs have been used, reset the set to start a new batch
  if (usedGifIndices.value.size === availableGiggleGifs.length) {
    usedGifIndices.value.clear()
  }

  // Get list of available indices (not yet used)
  const availableIndices = availableGiggleGifs
    .map((_, index) => index)
    .filter(index => !usedGifIndices.value.has(index))

  // Pick a random available index
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]

  // Mark this index as used
  usedGifIndices.value.add(randomIndex)

  return availableGiggleGifs[randomIndex]
}

/**
 * Calculate a random position outside the invitation box
 * Avoids placing giggle boxes on top of the invitation content
 */
function calculateRandomGigglePosition() {
  const padding = 20
  const boxSize = 100

  // Find the invitation box element
  const invitationBox = document.querySelector('.invitation__box')
  let invitationBounds = null

  if (invitationBox) {
    invitationBounds = invitationBox.getBoundingClientRect()
  }

  let x, y, valid

  // Keep trying positions until we find one outside the invitation box
  do {
    valid = true
    x = Math.random() * (window.innerWidth - boxSize - padding) + padding
    y = Math.random() * (window.innerHeight - boxSize - padding) + padding

    // Check if position overlaps with invitation box
    if (invitationBounds) {
      const giggleRect = {
        left: x,
        right: x + boxSize,
        top: y,
        bottom: y + boxSize
      }

      // Check for overlap
      if (!(giggleRect.right < invitationBounds.left ||
            giggleRect.left > invitationBounds.right ||
            giggleRect.bottom < invitationBounds.top ||
            giggleRect.top > invitationBounds.bottom)) {
        valid = false
      }
    }
  } while (!valid)

  return { x, y }
}

/**
 * Create a floating giggle box at random position
 * Box displays a random giggle GIF and removes itself when done
 */
function createGiggleBox() {
  const id = giggleBoxIdCounter++
  const gifUrl = getRandomGiggleGif()
  const position = calculateRandomGigglePosition()

  const giggleBox = {
    id,
    gifUrl,
    position
  }

  floatingGiggleBoxes.value.push(giggleBox)

  // Remove giggle box after GIF finishes (assume 2-3 seconds for loading + playback)
  // You can adjust the timeout based on actual GIF duration
  setTimeout(() => {
    floatingGiggleBoxes.value = floatingGiggleBoxes.value.filter(box => box.id !== id)
  }, 3000)
}

/**
 * Initialize no button to natural position
 */
function initializePositions() {
  // Start at natural DOM position (no translation)
  noButtonPosition.value = { x: 0, y: 0 }
}

function announceNoBehavior() {
  // Accessibility: ensure screen readers receive hint via live region (sr-only span)
  // Nothing else required; keyboard users are guided to use the Yes button
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
  requestAnimationFrame(() => initializePositions())
})
</script>

<style scoped>
@import '../styles/buttons.bemit.css';

.giggle-box {
  position: fixed;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 1000;
  animation: giggle-pop-in 0.3s ease-out;
}

.giggle-box__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes giggle-pop-in {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
