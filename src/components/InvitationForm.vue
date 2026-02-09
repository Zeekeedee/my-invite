<template>
  <div class="form">
    <div class="form__container">
      <h2 class="form__title">Create Your Invitation</h2>
      <p class="form__description">Fill in the details below to create a cute invitation</p>

      <form @submit.prevent="handleSubmit" class="form__fields">
        <!-- Recipient Name Field -->
        <div class="form__section">
          <label for="recipient-name" class="form__label">Recipient Name *</label>
          <input
            id="recipient-name"
            v-model="form.recipientName"
            type="text"
            class="form__input"
            :class="{ 'form__input--error': errors.recipientName }"
            placeholder="e.g., Alice"
            @blur="validateField('recipientName')"
          />
          <span v-if="errors.recipientName" class="form__error">
            {{ errors.recipientName }}
          </span>
        </div>

        <!-- Sender Name Field -->
        <div class="form__section">
          <label for="sender-name" class="form__label">Your Name *</label>
          <input
            id="sender-name"
            v-model="form.senderName"
            type="text"
            class="form__input"
            :class="{ 'form__input--error': errors.senderName }"
            placeholder="e.g., Bob"
            @blur="validateField('senderName')"
          />
          <span v-if="errors.senderName" class="form__error">
            {{ errors.senderName }}
          </span>
        </div>

        <!-- GIF URL Field -->
        <div class="form__section">
          <label for="gif-url" class="form__label">Background GIF URL *</label>
          <input
            id="gif-url"
            v-model="form.gifUrl"
            type="url"
            class="form__input"
            :class="{ 'form__input--error': errors.gifUrl }"
            placeholder="e.g., https://example.com/confetti.gif"
            @blur="validateField('gifUrl')"
          />
          <span v-if="errors.gifUrl" class="form__error">
            {{ errors.gifUrl }}
          </span>
          <p class="form__hint">Must be a valid .gif URL</p>
        </div>

        <!-- Optional Image URL Field -->
        <div class="form__section">
          <label for="image-url" class="form__label">Image URL (Optional)</label>
          <input
            id="image-url"
            v-model="form.imageUrl"
            type="url"
            class="form__input"
            :class="{ 'form__input--error': errors.imageUrl }"
            placeholder="e.g., https://example.com/photo.jpg"
            @blur="validateField('imageUrl')"
          />
          <span v-if="errors.imageUrl" class="form__error">
            {{ errors.imageUrl }}
          </span>
          <p class="form__hint">JPG, PNG, or WebP format</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="form__button form__button--primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Generating...' : 'Generate Invitation Link' }}
        </button>
      </form>

      <!-- Generated Link Display -->
      <div v-if="generatedLink" class="form__result">
        <div class="form__result-content">
          <h3 class="form__result-title">Your Invitation Link is Ready!</h3>
          <p class="form__result-description">Copy and share this link with {{ form.recipientName }}:</p>
          
          <div class="form__link-box">
            <input
              v-model="generatedLink"
              type="text"
              class="form__link-input"
              readonly
            />
            <button
              type="button"
              class="form__button form__button--copy"
              @click="copyToClipboard"
            >
              {{ copiedText }}
            </button>
          </div>

          <button
            type="button"
            class="form__button form__button--secondary"
            @click="resetForm"
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateInvitationForm } from '../utils/validator.js'
import { createInvitation, encodeInvitation, isInvitationExpired } from '../utils/dataEncoder.js'
import { generateUrl } from '../utils/urlParser.js'

// Form state
const form = ref({
  recipientName: '',
  senderName: '',
  gifUrl: '',
  imageUrl: ''
})

const errors = ref({})
const isLoading = ref(false)
const generatedLink = ref('')
const copiedText = ref('Copy Link')

/**
 * Validates a single field
 */
function validateField(fieldName) {
  const fieldValue = form.value[fieldName]
  
  if (fieldName === 'recipientName') {
    if (!fieldValue || fieldValue.trim().length === 0) {
      errors.value.recipientName = 'Recipient name is required'
    } else if (fieldValue.length > 100) {
      errors.value.recipientName = 'Name must be 100 characters or less'
    } else {
      delete errors.value.recipientName
    }
  }
  
  if (fieldName === 'senderName') {
    if (!fieldValue || fieldValue.trim().length === 0) {
      errors.value.senderName = 'Your name is required'
    } else if (fieldValue.length > 100) {
      errors.value.senderName = 'Name must be 100 characters or less'
    } else {
      delete errors.value.senderName
    }
  }
  
  if (fieldName === 'gifUrl') {
    if (!fieldValue || fieldValue.trim().length === 0) {
      errors.value.gifUrl = 'GIF URL is required'
    } else {
      try {
        new URL(fieldValue)
        if (!fieldValue.toLowerCase().endsWith('.gif')) {
          errors.value.gifUrl = 'GIF URL must end with .gif'
        } else {
          delete errors.value.gifUrl
        }
      } catch (e) {
        errors.value.gifUrl = 'Please enter a valid URL'
      }
    }
  }
  
  if (fieldName === 'imageUrl') {
    if (fieldValue && fieldValue.trim().length > 0) {
      try {
        new URL(fieldValue)
        const validFormats = ['.jpg', '.jpeg', '.png', '.webp']
        const isValid = validFormats.some(format => fieldValue.toLowerCase().endsWith(format))
        if (!isValid) {
          errors.value.imageUrl = 'Image must be JPG, PNG, or WebP format'
        } else {
          delete errors.value.imageUrl
        }
      } catch (e) {
        errors.value.imageUrl = 'Please enter a valid URL'
      }
    } else {
      delete errors.value.imageUrl
    }
  }
}

/**
 * Handles form submission
 */
async function handleSubmit() {
  // Validate all fields
  const validation = validateInvitationForm(form.value)
  
  if (!validation.valid) {
    errors.value = validation.errors
    return
  }

  isLoading.value = true

  try {
    // Create invitation
    const invitation = await createInvitation(form.value)
    
    // Encode invitation data
    const encodedData = encodeInvitation(invitation)
    
    // Generate shareable link
    generatedLink.value = generateUrl({ id: encodedData })
  } catch (error) {
    console.error('Failed to generate link:', error)
    errors.value.general = 'Failed to generate invitation. Please try again.'
  } finally {
    isLoading.value = false
  }
}

/**
 * Copies link to clipboard
 */
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(generatedLink.value)
    copiedText.value = '✓ Copied!'
    setTimeout(() => {
      copiedText.value = 'Copy Link'
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
    copiedText.value = 'Failed to copy'
  }
}

/**
 * Resets form for creating another invitation
 */
function resetForm() {
  form.value = {
    recipientName: '',
    senderName: '',
    gifUrl: '',
    imageUrl: ''
  }
  errors.value = {}
  generatedLink.value = ''
  copiedText.value = 'Copy Link'
}
</script>

<style scoped>
.form {
  width: 100%;
  padding: 1.5rem;
}

.form__container {
  max-width: 600px;
  margin: 0 auto;
}

.form__title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 0.5rem;
  color: #2d3436;
  text-align: center;
}

.form__description {
  text-align: center;
  color: #636e72;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.form__fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form__section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form__label {
  font-weight: 500;
  color: #2d3436;
  font-size: 0.95rem;
}

.form__input {
  padding: 0.75rem 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 250ms ease;
  background-color: white;
}

.form__input:focus {
  outline: none;
  border-color: #fdcb6e;
  box-shadow: 0 0 0 3px rgba(253, 203, 110, 0.1);
}

.form__input--error {
  border-color: #d63031;
  background-color: rgba(214, 48, 49, 0.05);
}

.form__error {
  font-size: 0.85rem;
  color: #d63031;
  display: block;
}

.form__hint {
  font-size: 0.8rem;
  color: #b2bec3;
  margin: 0;
}

.form__button {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 250ms ease;
  min-height: 44px;
}

.form__button--primary {
  background-color: #fdcb6e;
  color: white;
  box-shadow: 0 4px 12px rgba(253, 203, 110, 0.3);
}

.form__button--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(253, 203, 110, 0.4);
}

.form__button--primary:active:not(:disabled) {
  transform: translateY(0);
}

.form__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form__result {
  margin-top: 2.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(253, 203, 110, 0.1), rgba(250, 177, 160, 0.1));
  border-radius: 12px;
  border: 2px solid #fdcb6e;
  animation: slideUp 0.6s ease-out;
}

.form__result-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form__result-title {
  color: #2d3436;
  margin: 0;
}

.form__result-description {
  color: #636e72;
  margin: 0;
  font-size: 0.95rem;
}

.form__link-box {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.form__link-input {
  flex: 1;
  min-width: 200px;
  padding: 0.875rem 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  background-color: white;
  word-break: break-all;
}

.form__button--copy {
  background-color: #00b894;
  color: white;
  padding: 0.875rem 1.25rem;
  white-space: nowrap;
}

.form__button--copy:hover {
  background-color: #00a377;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 184, 148, 0.3);
}

.form__button--secondary {
  background-color: transparent;
  color: #fdcb6e;
  border: 2px solid #fdcb6e;
}

.form__button--secondary:hover {
  background-color: rgba(253, 203, 110, 0.1);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (min-width: 481px) {
  .form {
    padding: 2rem;
  }

  .form__link-box {
    flex-wrap: nowrap;
  }

  .form__link-input {
    flex: 1;
  }
}

@media (min-width: 769px) {
  .form {
    padding: 2.5rem;
  }

  .form__title {
    margin-bottom: 1rem;
  }

  .form__result {
    padding: 2.5rem;
  }
}

/* Animations */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
