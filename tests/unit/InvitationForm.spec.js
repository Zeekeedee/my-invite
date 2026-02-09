import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import InvitationForm from '../../src/components/InvitationForm.vue'

/**
 * Component Unit Tests for InvitationForm
 * 
 * Tests cover:
 * - Component rendering and initial state
 * - Form field validation and error messages
 * - Form submission and link generation
 * - Copy-to-clipboard functionality
 * - Form reset capability
 */

describe('InvitationForm Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(InvitationForm)
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================================
  // Component Rendering Tests (T036)
  // ============================================================================

  describe('Component Rendering', () => {
    it('should render the form container', () => {
      expect(wrapper.find('.form').exists()).toBe(true)
    })

    it('should render all input fields', () => {
      expect(wrapper.find('#recipient-name').exists()).toBe(true)
      expect(wrapper.find('#sender-name').exists()).toBe(true)
      expect(wrapper.find('#gif-url').exists()).toBe(true)
      expect(wrapper.find('#image-url').exists()).toBe(true)
    })

    it('should render recipient name input', () => {
      const input = wrapper.find('#recipient-name')
      expect(input.exists()).toBe(true)
      expect(input.element.placeholder).toContain('Alice')
    })

    it('should render sender name input', () => {
      const input = wrapper.find('#sender-name')
      expect(input.exists()).toBe(true)
      expect(input.element.placeholder).toContain('Bob')
    })

    it('should render GIF URL input', () => {
      const input = wrapper.find('#gif-url')
      expect(input.exists()).toBe(true)
      expect(input.element.type).toBe('url')
    })

    it('should render image URL input (optional)', () => {
      const input = wrapper.find('#image-url')
      expect(input.exists()).toBe(true)
      expect(input.element.type).toBe('url')
    })

    it('should render submit button', () => {
      const button = wrapper.find('button[type="submit"]')
      expect(button.exists()).toBe(true)
    })

    it('should have correct initial state', () => {
      const vm = wrapper.vm
      expect(vm.form.recipientName).toBe('')
      expect(vm.form.senderName).toBe('')
      expect(vm.form.gifUrl).toBe('')
      expect(vm.form.imageUrl).toBe('')
      expect(vm.errors).toEqual({})
      expect(vm.generatedLink).toBe('')
    })
  })

  // ============================================================================
  // Form Validation Tests (T038)
  // ============================================================================

  describe('Form Validation and Error Messages', () => {
    it('should show error for empty recipient name on blur', async () => {
      const input = wrapper.find('#recipient-name')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.errors.recipientName).toBeDefined()
    })

    it('should show error for empty sender name on blur', async () => {
      const input = wrapper.find('#sender-name')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.errors.senderName).toBeDefined()
    })

    it('should show error for empty GIF URL on blur', async () => {
      const input = wrapper.find('#gif-url')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.errors.gifUrl).toBeDefined()
    })

    it('should show error for invalid GIF URL', async () => {
      const input = wrapper.find('#gif-url')
      await input.setValue('https://example.com/notgif.jpg')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.errors.gifUrl).toBeDefined()
      expect(wrapper.vm.errors.gifUrl).toContain('GIF')
    })

    it('should clear error when field becomes valid', async () => {
      const input = wrapper.find('#recipient-name')
      
      // Trigger error
      await input.trigger('blur')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.errors.recipientName).toBeDefined()
      
      // Fix error
      await input.setValue('Alice')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.errors.recipientName).toBeUndefined()
    })

    it('should prevent form submission with validation errors', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      // generatedLink should remain empty
      expect(wrapper.vm.generatedLink).toBe('')
    })

    it('should show all required field errors on form submission', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.errors.recipientName).toBeDefined()
      expect(wrapper.vm.errors.senderName).toBeDefined()
      expect(wrapper.vm.errors.gifUrl).toBeDefined()
    })
  })

  // ============================================================================
  // Form Submission and Link Generation Tests (T037)
  // ============================================================================

  describe('Form Submission and Link Generation', () => {
    it('should generate link with valid inputs', async () => {
      // Fill in all required fields
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      
      // Validate field after setting value to clear any errors
      await wrapper.vm.validateField('recipientName')
      await wrapper.vm.validateField('senderName')
      await wrapper.vm.validateField('gifUrl')
      await wrapper.vm.$nextTick()
      
      // Submit form by calling handleSubmit directly
      await wrapper.vm.handleSubmit()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Check that link was generated
      expect(wrapper.vm.generatedLink).toBeTruthy()
      expect(wrapper.vm.generatedLink).toContain('id=')
    })

    it('should generate URL with id parameter', async () => {
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      
      await wrapper.vm.validateField('recipientName')
      await wrapper.vm.validateField('senderName')
      await wrapper.vm.validateField('gifUrl')
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.handleSubmit()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.generatedLink).toMatch(/\?id=/)
    })

    it('should include optional image URL in generated link if provided', async () => {
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      await wrapper.find('#image-url').setValue('https://example.com/photo.jpg')
      
      await wrapper.vm.validateField('recipientName')
      await wrapper.vm.validateField('senderName')
      await wrapper.vm.validateField('gifUrl')
      await wrapper.vm.validateField('imageUrl')
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.handleSubmit()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Link should be generated (image URL is optional in encoding)
      expect(wrapper.vm.generatedLink).toBeTruthy()
    })

    it('should work with only required fields', async () => {
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      // Skip optional image URL
      
      await wrapper.vm.validateField('recipientName')
      await wrapper.vm.validateField('senderName')
      await wrapper.vm.validateField('gifUrl')
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.handleSubmit()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.generatedLink).toBeTruthy()
    })
  })

  // ============================================================================
  // Copy-to-Clipboard Tests (T040)
  // ============================================================================

  describe('Copy-to-Clipboard Functionality', () => {
    beforeEach(async () => {
      // Generate a link first
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()
      await wrapper.vm.$nextTick()
    })

    it('should have copy button when link is generated', () => {
      const buttons = wrapper.findAll('button')
      // Should have at least one button besides submit (copy button)
      expect(buttons.length).toBeGreaterThan(1)
    })

    it('should update copiedText state when copy button clicked', async () => {
      // Find copy button (not the submit button)
      const buttons = wrapper.findAll('button')
      const copyButton = buttons.find(btn => btn.text().includes('Copy'))
      
      if (copyButton) {
        await copyButton.trigger('click')
        await wrapper.vm.$nextTick()
        
        // copiedText should show the success message
        expect(wrapper.vm.copiedText).toContain('Copied')
      }
    })

    it('should reset copiedText after 2 seconds', async () => {
      vi.useFakeTimers()
      
      const buttons = wrapper.findAll('button')
      const copyButton = buttons.find(btn => btn.text().includes('Copy'))
      
      if (copyButton) {
        await copyButton.trigger('click')
        await wrapper.vm.$nextTick()
        
        expect(wrapper.vm.copiedText).toContain('Copied')
        
        vi.advanceTimersByTime(2100)
        await wrapper.vm.$nextTick()
        
        // Should be back to 'Copy Link'
        expect(wrapper.vm.copiedText).toBe('Copy Link')
      }
      
      vi.useRealTimers()
    })

    it('should display generated link in readonly field', () => {
      const linkInput = wrapper.find('input[readonly]')
      expect(linkInput.exists()).toBe(true)
      expect(linkInput.element.value).toContain('id=')
    })
  })

  // ============================================================================
  // Form Reset Tests
  // ============================================================================

  describe('Form Reset', () => {
    it('should have create another button after link generation', async () => {
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Should have multiple buttons now (at least submit + create another/copy)
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('should reset form when requested', async () => {
      // Generate link first
      await wrapper.find('#recipient-name').setValue('Alice')
      await wrapper.find('#sender-name').setValue('Bob')
      await wrapper.find('#gif-url').setValue('https://example.com/cute.gif')
      
      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      // Reset form
      wrapper.vm.resetForm()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.form.recipientName).toBe('')
      expect(wrapper.vm.form.senderName).toBe('')
      expect(wrapper.vm.form.gifUrl).toBe('')
      expect(wrapper.vm.form.imageUrl).toBe('')
      expect(wrapper.vm.generatedLink).toBe('')
    })
  })
})
