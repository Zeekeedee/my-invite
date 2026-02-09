/**
 * URL parameter parsing utilities
 * Phase 2, Task T018
 */

/**
 * Gets URL search parameters as an object
 * @returns {object} Query parameters object
 */
export function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const obj = {}
  for (const [key, value] of params.entries()) {
    obj[key] = value
  }
  return obj
}

/**
 * Gets a specific URL parameter value
 * @param {string} paramName - Name of the parameter
 * @returns {string | null} Parameter value or null
 */
export function getUrlParam(paramName) {
  const params = new URLSearchParams(window.location.search)
  return params.get(paramName)
}

/**
 * Sets URL parameters and updates browser history
 * @param {object} params - Object of parameters to set
 * @param {boolean} replace - If true, replace history entry instead of pushing
 */
export function setUrlParams(params, replace = false) {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value)
    }
  }
  
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`
  const stateObj = { path: newUrl }
  
  if (replace) {
    window.history.replaceState(stateObj, '', newUrl)
  } else {
    window.history.pushState(stateObj, '', newUrl)
  }
}

/**
 * Removes a parameter from URL
 * @param {string} paramName - Name of parameter to remove
 * @param {boolean} replace - If true, replace history entry
 */
export function removeUrlParam(paramName, replace = true) {
  const params = new URLSearchParams(window.location.search)
  params.delete(paramName)
  
  const newUrl = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname
  
  const stateObj = { path: newUrl }
  
  if (replace) {
    window.history.replaceState(stateObj, '', newUrl)
  } else {
    window.history.pushState(stateObj, '', newUrl)
  }
}

/**
 * Checks if current URL has a specific parameter
 * @param {string} paramName - Name of parameter to check
 * @returns {boolean} True if parameter exists
 */
export function hasUrlParam(paramName) {
  const params = new URLSearchParams(window.location.search)
  return params.has(paramName)
}

/**
 * Gets all URL parameters as a query string
 * @returns {string} Query string without the leading ?
 */
export function getQueryString() {
  return window.location.search.substring(1)
}

/**
 * Generates a URL with parameters
 * @param {object} params - Parameters object
 * @param {string} basePath - Base path (default: current path)
 * @returns {string} Full URL with parameters
 */
export function generateUrl(params, basePath = window.location.pathname) {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value)
    }
  }
  
  const queryString = searchParams.toString()
  const origin = window.location.origin
  return queryString ? `${origin}${basePath}?${queryString}` : `${origin}${basePath}`
}
