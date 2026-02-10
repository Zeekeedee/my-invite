/**
 * Validation utilities for form inputs
 * Phase 2, Task T016
 */

/**
 * Validates required string fields
 * @param {string} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateRequired(value, fieldName = 'Field') {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      error: `${fieldName} is required`
    }
  }
  return { valid: true, error: null }
}

/**
 * Validates string length
 * @param {string} value - The value to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateLength(value, minLength = 1, maxLength = 100) {
  if (value.length < minLength) {
    return {
      valid: false,
      error: `Must be at least ${minLength} character(s)`
    }
  }
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `Must be no more than ${maxLength} character(s)`
    }
  }
  return { valid: true, error: null }
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateUrl(url) {
  try {
    new URL(url)
    return { valid: true, error: null }
  } catch (e) {
    return {
      valid: false,
      error: 'Please enter a valid URL'
    }
  }
}

/**
 * Validates GIF file URL
 * @param {string} url - URL to validate
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateGifUrl(url) {
  const urlValidation = validateUrl(url)
  if (!urlValidation.valid) {
    return urlValidation
  }

  if (!url.toLowerCase().endsWith('.gif')) {
    return {
      valid: false,
      error: 'GIF URL must end with .gif'
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates image file URL
 * @param {string} url - URL to validate
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateImageUrl(url) {
  if (!url) {
    return { valid: true, error: null } // Image is optional
  }

  const urlValidation = validateUrl(url)
  if (!urlValidation.valid) {
    return urlValidation
  }

  const validFormats = ['.jpg', '.jpeg', '.png', '.webp']
  const lowerUrl = url.toLowerCase()
  const isValid = validFormats.some(format => lowerUrl.endsWith(format))

  if (!isValid) {
    return {
      valid: false,
      error: 'Image must be JPG, PNG, or WebP format'
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates file size (in bytes)
 * @param {number} size - File size in bytes
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateFileSize(size, maxSizeMB = 10) {
  const maxBytes = maxSizeMB * 1024 * 1024
  if (size > maxBytes) {
    return {
      valid: false,
      error: `File must be smaller than ${maxSizeMB}MB`
    }
  }
  return { valid: true, error: null }
}

/**
 * Validates entire invitation form
 * @param {object} formData - Form data to validate
 * @returns {object} { valid: boolean, errors: { [key]: string } }
 */
export function validateInvitationForm(formData) {
  const errors = {}

  // Validate recipient name
  const recipientValidation = validateRequired(formData.recipientName, 'Recipient name')
  if (!recipientValidation.valid) {
    errors.recipientName = recipientValidation.error
  } else {
    const lengthValidation = validateLength(formData.recipientName, 1, 100)
    if (!lengthValidation.valid) {
      errors.recipientName = lengthValidation.error
    }
  }

  // Validate sender name
  const senderValidation = validateRequired(formData.senderName, 'Sender name')
  if (!senderValidation.valid) {
    errors.senderName = senderValidation.error
  } else {
    const lengthValidation = validateLength(formData.senderName, 1, 100)
    if (!lengthValidation.valid) {
      errors.senderName = lengthValidation.error
    }
  }

  // Background is fixed to animated 8-bit hearts; no GIF validation required

  // Validate image URL (optional)
  if (formData.imageUrl) {
    const imageValidation = validateImageUrl(formData.imageUrl)
    if (!imageValidation.valid) {
      errors.imageUrl = imageValidation.error
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
