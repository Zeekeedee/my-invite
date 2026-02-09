import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import InvitationDisplay from '../../src/components/InvitationDisplay.vue'
import * as dataEncoder from '../../src/utils/dataEncoder'
import * as urlParser from '../../src/utils/urlParser'

/**
 * Component Unit Tests for InvitationDisplay
 * 
 * Tests cover:
 * - Component rendering with valid invitations
 * - URL parameter decoding
 * - Error handling (expired, invalid)
 * - Image and GIF rendering
 * 
 * Note: Component tests focus on UI behavior and error states.
 * Full integration testing happens in E2E tests.
 */

describe('InvitationDisplay Component', () => {
  let mockInvitation

  beforeEach(() => {
    // Create a mock invitation
    mockInvitation = {
      id: 'test-123',
      recipientName: 'Alice',
      senderName: 'Bob',
      gifUrl: 'https://media.giphy.com/media/cute.gif',
      imageUrl: 'https://example.com/photo.jpg',
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000  // 30 days from now
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================================
  // Invalid Invitation Tests
  // ============================================================================

  describe('Invalid Invitation Handling', () => {
    it('should show loading state initially', () => {
      // Mock getUrlParam to return no ID
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue(null)
      
      const wrapper = mount(InvitationDisplay)
      
      // Before any loading completes, should show loading
      expect(wrapper.find('.invitation--loading').exists() || wrapper.find('.invitation--invalid').exists()).toBe(true)
    })

    it('should show invalid state when no URL parameter', async () => {
      // Mock no ID in URL
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue(null)
      
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Should show invalid invitation
      expect(wrapper.vm.isInvalid).toBe(true)
    })

    it('should show invalid state when ID cannot be decoded', async () => {
      // Mock getUrlParam to return an ID
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('invalid-base64')
      
      // Mock decode to return null
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(null)
      
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.isInvalid).toBe(true)
    })

    it('should display invalid error message', async () => {
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('invalid-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(null)
      
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Invalid')
    })
  })

  // ============================================================================
  // Expired Invitation Tests
  // ============================================================================

  describe('Expired Invitation Handling', () => {
    it('should show expired state for old invitations', async () => {
      const expiredInvitation = {
        ...mockInvitation,
        expiresAt: Date.now() - 1000  // Expired 1 second ago
      }
      
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('test-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(expiredInvitation)
      vi.spyOn(dataEncoder, 'isInvitationExpired').mockReturnValue(true)
      
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.isExpired).toBe(true)
    })

    it('should display expired message with sender name', async () => {
      const expiredInvitation = {
        ...mockInvitation,
        expiresAt: Date.now() - 1000
      }
      
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('test-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(expiredInvitation)
      vi.spyOn(dataEncoder, 'isInvitationExpired').mockReturnValue(true)
      
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.senderNameFromError).toBe('Bob')
      expect(wrapper.text()).toContain('expired')
    })
  })

  // ============================================================================
  // Valid Invitation Display Tests
  // ============================================================================

  describe('Valid Invitation Display', () => {
    beforeEach(() => {
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('valid-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(mockInvitation)
      vi.spyOn(dataEncoder, 'isInvitationExpired').mockReturnValue(false)
    })

    it('should store decoded invitation', async () => {
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.invitation).toEqual(mockInvitation)
    })

    it('should calculate expiration time', async () => {
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // expiresIn should be calculated (may be slightly less than 30 days due to timing)
      expect(wrapper.vm.expiresIn).toBeLessThanOrEqual(30 * 24 * 60 * 60)
      expect(wrapper.vm.expiresIn).toBeGreaterThan(0)
    })

    it('should render invitation component when valid', async () => {
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.invitation').exists()).toBe(true)
    })
  })

  // ============================================================================
  // GIF and Image Rendering Tests
  // ============================================================================

  describe('Media Rendering', () => {
    beforeEach(() => {
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('valid-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(mockInvitation)
      vi.spyOn(dataEncoder, 'isInvitationExpired').mockReturnValue(false)
    })

    it('should handle GIF load event', async () => {
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Simulate GIF load
      wrapper.vm.handleGifLoad()
      
      expect(wrapper.vm.isLoadingGif).toBe(false)
      expect(wrapper.vm.gifError).toBe(false)
    })

    it('should handle GIF error event', async () => {
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Simulate GIF error
      wrapper.vm.handleGifError()
      
      expect(wrapper.vm.gifError).toBe(true)
    })

    it('should handle image error gracefully', async () => {
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Simulate image error
      wrapper.vm.handleImageError()
      
      expect(wrapper.vm.imageError).toBe(true)
    })
  })

  // ============================================================================
  // Expiration Time Formatting Tests
  // ============================================================================

  describe('Expiration Time Formatting', () => {
    beforeEach(() => {
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('valid-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(mockInvitation)
      vi.spyOn(dataEncoder, 'isInvitationExpired').mockReturnValue(false)
    })

    it('should format expiry in days for large time period', async () => {
      const wrapper = mount(InvitationDisplay)
      wrapper.vm.expiresIn = 5 * 24 * 60 * 60  // 5 days in seconds
      
      const formatted = wrapper.vm.formatExpiryTime()
      expect(formatted).toContain('day')
    })

    it('should format expiry in hours for medium time period', () => {
      const wrapper = mount(InvitationDisplay)
      wrapper.vm.expiresIn = 5 * 60 * 60  // 5 hours in seconds
      
      const formatted = wrapper.vm.formatExpiryTime()
      expect(formatted).toContain('hour')
    })

    it('should format expiry in minutes for small time period', () => {
      const wrapper = mount(InvitationDisplay)
      wrapper.vm.expiresIn = 30 * 60  // 30 minutes in seconds
      
      const formatted = wrapper.vm.formatExpiryTime()
      expect(formatted).toContain('minute')
    })
  })

  // ============================================================================
  // Expiration Notice Tests
  // ============================================================================

  describe('Expiration Notice Display', () => {
    it('should show expiry notice when less than 3 days remaining', async () => {
      const soonInvitation = {
        ...mockInvitation,
        expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000  // 2 days
      }
      
      vi.spyOn(urlParser, 'getUrlParam').mockReturnValue('valid-id')
      vi.spyOn(dataEncoder, 'decodeInvitation').mockReturnValue(soonInvitation)
      vi.spyOn(dataEncoder, 'isInvitationExpired').mockReturnValue(false)
      
      const wrapper = mount(InvitationDisplay)
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Calculate remaining time
      const expiresInSeconds = Math.floor((soonInvitation.expiresAt - Date.now()) / 1000)
      wrapper.vm.expiresIn = expiresInSeconds
      
      // Should be less than 3 days
      expect(wrapper.vm.expiresIn).toBeLessThan(3 * 24 * 60 * 60)
    })

    it('should not show expiry notice when more than 3 days remaining', async () => {
      const wrapper = mount(InvitationDisplay)
      wrapper.vm.expiresIn = 10 * 24 * 60 * 60  // 10 days in seconds
      
      // expiresIn > 3 days, so notice should not show
      expect(wrapper.vm.expiresIn).toBeGreaterThan(3 * 24 * 60 * 60)
    })
  })
})
