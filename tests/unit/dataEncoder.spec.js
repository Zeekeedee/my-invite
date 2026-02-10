/**
 * Unit tests for data encoder utilities
 * Phase 2, Task T021
 */

import { describe, it, expect } from 'vitest'
import {
  encodeInvitation,
  decodeInvitation,
  isInvitationExpired,
  validateInvitationSchema
} from '../../src/utils/dataEncoder.js'

describe('Data Encoder Utils', () => {
  const testInvitation = {
    id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    recipientName: 'Alice',
    senderName: 'Bob',
    gifUrl: 'https://example.com/confetti.gif',
    imageUrl: 'https://example.com/photo.jpg',
    createdAt: '2026-02-09T10:30:00Z',
    expiresAt: '2026-03-11T10:30:00Z',
    status: 'active'
  }

  describe('encodeInvitation', () => {
    it('should encode invitation to Base64 string', () => {
      const encoded = encodeInvitation(testInvitation)
      expect(typeof encoded).toBe('string')
      expect(encoded.length > 0).toBe(true)
      // Should be valid Base64
      expect(() => atob(encoded)).not.toThrow()
    })

    it('should produce different encodings for different data', () => {
      const invitation2 = { ...testInvitation, recipientName: 'Eve' }
      const encoded1 = encodeInvitation(testInvitation)
      const encoded2 = encodeInvitation(invitation2)
      expect(encoded1).not.toBe(encoded2)
    })
  })

  describe('decodeInvitation', () => {
    it('should decode Base64 back to invitation object', () => {
      const encoded = encodeInvitation(testInvitation)
      const decoded = decodeInvitation(encoded)
      expect(decoded).toEqual(testInvitation)
    })

    it('should reject empty string', () => {
      expect(() => decodeInvitation('')).toThrow()
    })

    it('should reject invalid Base64', () => {
      expect(() => decodeInvitation('not valid base64!@#$')).toThrow()
    })

    it('should reject invalid JSON', () => {
      const invalidBase64 = btoa('not valid json')
      expect(() => decodeInvitation(invalidBase64)).toThrow()
    })

    it('should reject missing required fields', () => {
      const incomplete = { recipientName: 'Alice' }
      const encoded = btoa(JSON.stringify(incomplete))
      expect(() => decodeInvitation(encoded)).toThrow('Missing required field')
    })
  })

  describe('isInvitationExpired', () => {
    it('should return false for active invitation', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const invitation = { ...testInvitation, expiresAt: futureDate }
      expect(isInvitationExpired(invitation)).toBe(false)
    })

    it('should return true for expired invitation', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      const invitation = { ...testInvitation, expiresAt: pastDate }
      expect(isInvitationExpired(invitation)).toBe(true)
    })
  })

  describe('validateInvitationSchema', () => {
    it('should validate correct schema', () => {
      const result = validateInvitationSchema(testInvitation)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('should reject missing id', () => {
      const invalid = { ...testInvitation }
      delete invalid.id
      const result = validateInvitationSchema(invalid)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('id'))).toBe(true)
    })

    it('should reject invalid status', () => {
      const invalid = { ...testInvitation, status: 'pending' }
      const result = validateInvitationSchema(invalid)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('status'))).toBe(true)
    })

    it('should reject empty names', () => {
      const invalid = { ...testInvitation, recipientName: '' }
      const result = validateInvitationSchema(invalid)
      expect(result.valid).toBe(false)
    })
  })

  describe('Round-trip encoding', () => {
    it('should survive multiple encode/decode cycles', () => {
      let data = testInvitation
      for (let i = 0; i < 3; i++) {
        const encoded = encodeInvitation(data)
        data = decodeInvitation(encoded)
      }
      expect(data).toEqual(testInvitation)
    })
  })
})
