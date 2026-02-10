/**
 * Unit tests for validator utilities
 * Phase 2, Task T020
 */

import { describe, it, expect } from 'vitest'
import {
  validateRequired,
  validateLength,
  validateUrl,
  validateGifUrl,
  validateImageUrl,
  validateInvitationForm
} from '../../src/utils/validator.js'

describe('Validator Utils', () => {
  describe('validateRequired', () => {
    it('should validate required field with value', () => {
      const result = validateRequired('Alice', 'Name')
      expect(result.valid).toBe(true)
      expect(result.error).toBe(null)
    })

    it('should reject empty string', () => {
      const result = validateRequired('', 'Name')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should reject whitespace only', () => {
      const result = validateRequired('   ', 'Name')
      expect(result.valid).toBe(false)
    })

    it('should use default field name', () => {
      const result = validateRequired('')
      expect(result.error).toContain('Field')
    })
  })

  describe('validateLength', () => {
    it('should validate string within length limits', () => {
      const result = validateLength('Alice', 1, 100)
      expect(result.valid).toBe(true)
    })

    it('should reject string below minimum length', () => {
      const result = validateLength('', 1, 100)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least')
    })

    it('should reject string above maximum length', () => {
      const result = validateLength('a'.repeat(101), 1, 100)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('no more than')
    })
  })

  describe('validateUrl', () => {
    it('should validate correct URL', () => {
      const result = validateUrl('https://example.com/image.gif')
      expect(result.valid).toBe(true)
    })

    it('should reject invalid URL', () => {
      const result = validateUrl('not a url')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('valid URL')
    })

    it('should accept http and https', () => {
      expect(validateUrl('http://example.com').valid).toBe(true)
      expect(validateUrl('https://example.com').valid).toBe(true)
    })
  })

  describe('validateGifUrl', () => {
    it('should validate GIF URL', () => {
      const result = validateGifUrl('https://example.com/animation.gif')
      expect(result.valid).toBe(true)
    })

    it('should reject non-GIF URL', () => {
      const result = validateGifUrl('https://example.com/image.jpg')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('.gif')
    })

    it('should be case insensitive', () => {
      const result = validateGifUrl('https://example.com/animation.GIF')
      expect(result.valid).toBe(true)
    })
  })

  describe('validateImageUrl', () => {
    it('should accept empty image URL (optional)', () => {
      const result = validateImageUrl('')
      expect(result.valid).toBe(true)
    })

    it('should validate JPG URL', () => {
      expect(validateImageUrl('https://example.com/photo.jpg').valid).toBe(true)
    })

    it('should validate PNG URL', () => {
      expect(validateImageUrl('https://example.com/photo.png').valid).toBe(true)
    })

    it('should validate WebP URL', () => {
      expect(validateImageUrl('https://example.com/photo.webp').valid).toBe(true)
    })

    it('should reject invalid image format', () => {
      const result = validateImageUrl('https://example.com/file.pdf')
      expect(result.valid).toBe(false)
    })
  })

  describe('validateInvitationForm', () => {
    it('should validate complete form', () => {
      const formData = {
        recipientName: 'Alice',
        senderName: 'Bob',
        gifUrl: 'https://example.com/confetti.gif',
        imageUrl: 'https://example.com/photo.jpg'
      }
      const result = validateInvitationForm(formData)
      expect(result.valid).toBe(true)
      expect(Object.keys(result.errors).length).toBe(0)
    })

    it('should validate with missing optional image', () => {
      const formData = {
        recipientName: 'Alice',
        senderName: 'Bob',
        gifUrl: 'https://example.com/confetti.gif',
        imageUrl: ''
      }
      const result = validateInvitationForm(formData)
      expect(result.valid).toBe(true)
    })

    it('should reject missing required fields', () => {
      const formData = {
        recipientName: '',
        senderName: '',
        gifUrl: '',
        imageUrl: ''
      }
      const result = validateInvitationForm(formData)
      expect(result.valid).toBe(false)
      expect(result.errors.recipientName).toBeDefined()
      expect(result.errors.senderName).toBeDefined()
      expect(result.errors.gifUrl).toBeDefined()
    })

    it('should reject invalid GIF URL', () => {
      const formData = {
        recipientName: 'Alice',
        senderName: 'Bob',
        gifUrl: 'https://example.com/image.jpg',
        imageUrl: ''
      }
      const result = validateInvitationForm(formData)
      expect(result.valid).toBe(false)
      expect(result.errors.gifUrl).toBeDefined()
    })
  })
})
