/**
 * Unit tests for URL parser utilities
 * Phase 2, Task T022
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getUrlParams,
  getUrlParam,
  hasUrlParam,
  generateUrl
} from '../../src/utils/urlParser.js'

describe('URL Parser Utils', () => {
  beforeEach(() => {
    // Reset URL to clean state
    window.history.replaceState(null, '', '/')
  })

  describe('getUrlParams', () => {
    it('should return empty object for URL without params', () => {
      const params = getUrlParams()
      expect(params).toEqual({})
    })

    it('should extract single parameter', () => {
      window.history.replaceState(null, '', '/?id=abc123')
      const params = getUrlParams()
      expect(params.id).toBe('abc123')
    })

    it('should extract multiple parameters', () => {
      window.history.replaceState(null, '', '/?id=abc&name=test')
      const params = getUrlParams()
      expect(params.id).toBe('abc')
      expect(params.name).toBe('test')
    })
  })

  describe('getUrlParam', () => {
    it('should return parameter value', () => {
      window.history.replaceState(null, '', '/?id=abc123')
      const value = getUrlParam('id')
      expect(value).toBe('abc123')
    })

    it('should return null for missing parameter', () => {
      window.history.replaceState(null, '', '/?id=abc')
      const value = getUrlParam('missing')
      expect(value).toBe(null)
    })
  })

  describe('hasUrlParam', () => {
    it('should return true if parameter exists', () => {
      window.history.replaceState(null, '', '/?id=abc')
      expect(hasUrlParam('id')).toBe(true)
    })

    it('should return false if parameter missing', () => {
      window.history.replaceState(null, '', '/?other=value')
      expect(hasUrlParam('id')).toBe(false)
    })
  })

  describe('generateUrl', () => {
    it('should generate URL with parameters', () => {
      const url = generateUrl({ id: 'abc123' })
      expect(url).toContain('id=abc123')
    })

    it('should handle multiple parameters', () => {
      const url = generateUrl({ id: 'abc', name: 'test' })
      expect(url).toContain('id=abc')
      expect(url).toContain('name=test')
    })

    it('should skip null/undefined parameters', () => {
      const url = generateUrl({ id: 'abc', empty: null, undef: undefined })
      expect(url).toContain('id=abc')
      expect(url).not.toContain('empty')
      expect(url).not.toContain('undef')
    })

    it('should use custom base path', () => {
      const url = generateUrl({ id: 'abc' }, '/custom')
      expect(url).toContain('/custom?')
    })

    it('should encode special characters', () => {
      const url = generateUrl({ data: 'hello world&special' })
      expect(url).toContain('data=')
      // Should be URL-encoded (+ for space, & preserved)
      expect(url).toContain('hello+world')
    })

    it('should handle Base64-encoded data', () => {
      const base64Data = btoa(JSON.stringify({ test: 'data' }))
      window.history.replaceState(null, '', `/?id=${base64Data}`)
      const extracted = getUrlParam('id')
      expect(extracted).toBe(base64Data)
    })
  })
})
