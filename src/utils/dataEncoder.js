/**
 * Data encoding/decoding utilities for invitation data
 * Phase 2, Task T017
 * Uses Base64 encoding for URL-safe data transmission
 */

import { validateInvitationForm } from './validator.js'

/**
 * Invitation data schema
 * @typedef {object} Invitation
 * @property {string} id - Unique identifier (SHA256 hash)
 * @property {string} recipientName - Recipient name
 * @property {string} senderName - Sender name
 * @property {string} gifUrl - URL to background GIF
 * @property {string} [imageUrl] - Optional URL to image
 * @property {string} createdAt - ISO8601 timestamp
 * @property {string} expiresAt - ISO8601 expiration timestamp
 * @property {string} status - 'active' or 'expired'
 */

/**
 * Generates a SHA256-like hash using the Web Crypto API
 * For simplicity in static context, uses a deterministic hash
 * @param {string} input - Input string to hash
 * @returns {Promise<string>} Hex-encoded hash
 */
async function generateHash(input) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Creates an invitation object from form data
 * @param {object} formData - Form input data
 * @returns {Promise<Invitation>} Invitation object
 */
export async function createInvitation(formData) {
  const validation = validateInvitationForm(formData)
  if (!validation.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`)
  }

  const now = new Date()
  const createdAt = now.toISOString()
  
  // Calculate expiration: 30 days from now
  const expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const expiresAt = expirationDate.toISOString()

  // Generate ID as hash of recipient + sender + timestamp
  const hashInput = `${formData.recipientName}${formData.senderName}${createdAt}`
  const id = await generateHash(hashInput)

  return {
    id,
    recipientName: formData.recipientName,
    senderName: formData.senderName,
    gifUrl: formData.gifUrl,
    imageUrl: formData.imageUrl || null,
    createdAt,
    expiresAt,
    status: 'active'
  }
}

/**
 * Encodes invitation data to Base64 string
 * @param {Invitation} invitation - Invitation object to encode
 * @returns {string} Base64-encoded invitation data
 */
export function encodeInvitation(invitation) {
  const json = JSON.stringify(invitation)
  const encoded = btoa(json) // Base64 encode
  return encoded
}

/**
 * Decodes Base64 string to invitation data
 * @param {string} encoded - Base64-encoded invitation data
 * @returns {Invitation} Decoded invitation object
 * @throws {Error} If decoding fails or data is invalid
 */
export function decodeInvitation(encoded) {
  if (!encoded) {
    throw new Error('No invitation data provided')
  }

  try {
    const json = atob(encoded) // Base64 decode
    const invitation = JSON.parse(json)
    
    // Validate required fields
    const requiredFields = ['id', 'recipientName', 'senderName', 'gifUrl', 'createdAt', 'expiresAt', 'status']
    for (const field of requiredFields) {
      if (!(field in invitation)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    return invitation
  } catch (error) {
    if (error.message.startsWith('Missing required field')) {
      throw error
    }
    throw new Error('Failed to decode invitation data. It may be corrupted.')
  }
}

/**
 * Checks if an invitation has expired
 * @param {Invitation} invitation - Invitation object to check
 * @returns {boolean} True if invitation has expired
 */
export function isInvitationExpired(invitation) {
  const expirationTime = new Date(invitation.expiresAt).getTime()
  const now = new Date().getTime()
  return now > expirationTime
}

/**
 * Validates invitation data schema
 * @param {Invitation} invitation - Invitation object to validate
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validateInvitationSchema(invitation) {
  const errors = []

  if (!invitation.id || typeof invitation.id !== 'string') {
    errors.push('Invalid or missing id')
  }
  if (!invitation.recipientName || typeof invitation.recipientName !== 'string' || invitation.recipientName.length === 0) {
    errors.push('Invalid or missing recipientName')
  }
  if (!invitation.senderName || typeof invitation.senderName !== 'string' || invitation.senderName.length === 0) {
    errors.push('Invalid or missing senderName')
  }
  if (!invitation.gifUrl || typeof invitation.gifUrl !== 'string') {
    errors.push('Invalid or missing gifUrl')
  }
  if (!['active', 'expired'].includes(invitation.status)) {
    errors.push('Invalid status')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
