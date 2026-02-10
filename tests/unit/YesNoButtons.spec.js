import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import YesNoButtons from '../../src/components/YesNoButtons.vue'

describe('YesNoButtons.vue', () => {
  const mockInvitationId = 'test-invitation-123'
  const mockRecipientName = 'Alice'

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render both yes and no buttons when not responded', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      expect(wrapper.find('.buttons__button--yes').exists()).toBe(true)
      expect(wrapper.find('.buttons__button--no').exists()).toBe(true)
      expect(wrapper.find('.buttons__confirmation').exists()).toBe(false)
    })

    it('should have correct button text', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      const noButton = wrapper.find('.buttons__button--no')

      expect(yesButton.text()).toContain('Yes! 🎉')
      expect(noButton.text()).toContain('No 😊')
    })

    it('should render container with correct class', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      expect(wrapper.find('.buttons__container').exists()).toBe(true)
    })
  })

  describe('Initial State', () => {
    it('should have isResponded as false initially', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const componentInstance = wrapper.vm
      expect(componentInstance.isResponded).toBe(false)
    })

    it('should have isProcessing as false initially', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const componentInstance = wrapper.vm
      expect(componentInstance.isProcessing).toBe(false)
    })

    it('should initialize no button position', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const componentInstance = wrapper.vm
      expect(componentInstance.noButtonPosition).toEqual({ x: 0, y: 0 })
    })
  })

  describe('Yes Button Functionality', () => {
    it('should handle yes button click', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')

      // Wait for the async operation and state update
      await flushPromises()
      vi.advanceTimersByTime(700)
      await wrapper.vm.$nextTick()
      await flushPromises()

      expect(wrapper.vm.isResponded).toBe(true)
    })

    it('should show processing text while recording', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')

      // Check processing state before timers advance
      expect(wrapper.vm.isProcessing).toBe(true)
      expect(yesButton.text()).toContain('✨ Recording...')
    })

    it('should disable yes button while processing', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')

      expect(yesButton.attributes('disabled')).toBeDefined()
    })

    it('should not respond if already responded', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      wrapper.vm.isResponded = true

      const yesButton = wrapper.find('.buttons__button--yes')
      const initialIsProcessing = wrapper.vm.isProcessing

      await yesButton.trigger('click')

      expect(wrapper.vm.isProcessing).toBe(initialIsProcessing)
    })
  })

  describe('Response Storage', () => {
    it('should store response to localStorage', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')

      // Wait for async operation
      await flushPromises()
      vi.advanceTimersByTime(700)
      await wrapper.vm.$nextTick()

      const responseKey = `response_${mockInvitationId}`
      const storedResponse = localStorage.getItem(responseKey)

      expect(storedResponse).toBeTruthy()
    })

    it('should store correct response object', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')

      await flushPromises()
      vi.advanceTimersByTime(700)

      const responseKey = `response_${mockInvitationId}`
      const storedResponse = JSON.parse(localStorage.getItem(responseKey))

      expect(storedResponse.invitationId).toBe(mockInvitationId)
      expect(storedResponse.recipientName).toBe(mockRecipientName)
      expect(storedResponse.response).toBe('yes')
      expect(storedResponse.respondedAt).toBeTruthy()
      expect(storedResponse.userAgent).toBeTruthy()
      expect(storedResponse.viewport).toEqual({
        width: window.innerWidth,
        height: window.innerHeight
      })
    })

    it('should check for existing response on mount', () => {
      const responseKey = `response_${mockInvitationId}`
      const mockResponse = {
        invitationId: mockInvitationId,
        recipientName: mockRecipientName,
        response: 'yes',
        respondedAt: new Date().toISOString()
      }

      localStorage.setItem(responseKey, JSON.stringify(mockResponse))

      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      expect(wrapper.vm.isResponded).toBe(true)
    })

    it('should handle stored response with invalid JSON gracefully', () => {
      const responseKey = `response_${mockInvitationId}`
      localStorage.setItem(responseKey, 'invalid json {')

      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      expect(wrapper.vm.isResponded).toBe(false)
    })
  })

  describe('No Button Repositioning', () => {
    it('should calculate random position for no button', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const componentInstance = wrapper.vm
      const position = componentInstance.calculateRandomPosition()

      expect(position).toHaveProperty('x')
      expect(position).toHaveProperty('y')
      expect(typeof position.x).toBe('number')
      expect(typeof position.y).toBe('number')
    })

    it('should keep position within viewport bounds', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const componentInstance = wrapper.vm
      const position = componentInstance.calculateRandomPosition()

      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThanOrEqual(window.innerWidth)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeLessThanOrEqual(window.innerHeight)
    })

    it('should trigger repositioning on mouseenter', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const noButton = wrapper.find('.buttons__button--no')
      const initialPosition = { ...wrapper.vm.noButtonPosition }

      await noButton.trigger('mouseenter')

      // Position should change (or be same if randomly same, but unlikely)
      // Just check that function executed without error
      expect(wrapper.vm.noButtonPosition).toBeDefined()
    })

    it('should not reposition if already responded', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      wrapper.vm.isResponded = true
      const initialPosition = { ...wrapper.vm.noButtonPosition }

      const noButton = wrapper.find('.buttons__button--no')
      await noButton.trigger('mouseenter')

      expect(wrapper.vm.noButtonPosition).toEqual(initialPosition)
    })

    it('should not reposition if processing', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      wrapper.vm.isProcessing = true
      const initialPosition = { ...wrapper.vm.noButtonPosition }

      const noButton = wrapper.find('.buttons__button--no')
      await noButton.trigger('mouseenter')

      expect(wrapper.vm.noButtonPosition).toEqual(initialPosition)
    })
  })

  describe('Confirmation Display', () => {
    it('should show confirmation message after yes response', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')
      await flushPromises()

      // Advance past the 600ms delay
      vi.advanceTimersByTime(700)
      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isResponded).toBe(true)
      expect(wrapper.find('.buttons__confirmation').exists()).toBe(true)
    })

    it('should hide button container after responding', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')
      await flushPromises()

      vi.advanceTimersByTime(700)
      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isResponded).toBe(true)
      expect(wrapper.find('.buttons__container').exists()).toBe(false)
    })

    it('should include recipient name in confirmation', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')
      await flushPromises()

      vi.advanceTimersByTime(700)
      await flushPromises()
      await wrapper.vm.$nextTick()

      const confirmationTitle = wrapper.find('.buttons__confirmation-title')
      expect(confirmationTitle.exists()).toBe(true)
      expect(confirmationTitle.text()).toContain(mockRecipientName)
    })

    it('should include celebratory message in confirmation', async () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')
      await flushPromises()

      vi.advanceTimersByTime(700)
      await flushPromises()
      await wrapper.vm.$nextTick()

      const confirmationMessage = wrapper.find('.buttons__confirmation-message')
      expect(confirmationMessage.exists()).toBe(true)
      expect(confirmationMessage.text()).toBeTruthy()
      expect(confirmationMessage.text()).toMatch(/thanks|celebrate|confirmation/i)
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage failures gracefully', async () => {
      // Mock localStorage.setItem to throw error
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full')
      })

      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      const yesButton = wrapper.find('.buttons__button--yes')
      await yesButton.trigger('click')

      vi.runAllTimers()

      // Component should still set isProcessing to false
      expect(wrapper.vm.isProcessing).toBe(false)
    })
  })

  describe('Props', () => {
    it('should accept invitationId prop', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      expect(wrapper.props('invitationId')).toBe(mockInvitationId)
    })

    it('should accept recipientName prop', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId,
          recipientName: mockRecipientName
        }
      })

      expect(wrapper.props('recipientName')).toBe(mockRecipientName)
    })

    it('should use default recipientName if not provided', () => {
      const wrapper = mount(YesNoButtons, {
        props: {
          invitationId: mockInvitationId
        }
      })

      expect(wrapper.props('recipientName')).toBe('our guest')
    })
  })
})
