/**
 * File handling utilities
 * Phase 2, Task T019
 */

/**
 * Reads a file and converts it to Base64 data URL
 * @param {File} file - File object from input
 * @returns {Promise<string>} Data URL string (data:image/gif;base64,...)
 * @throws {Error} If file reading fails
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      resolve(reader.result)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Gets file size in MB
 * @param {File} file - File object
 * @returns {number} File size in MB
 */
export function getFileSizeMB(file) {
  return file.size / (1024 * 1024)
}

/**
 * Checks if file is a valid image type
 * @param {File} file - File object to check
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if file type is allowed
 */
export function isValidImageType(file, allowedTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp']) {
  return allowedTypes.includes(file.type)
}

/**
 * Checks if file type matches extension
 * @param {File} file - File object
 * @returns {boolean} True if MIME type matches extension
 */
export function isMimeTypeMatchesExtension(file) {
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  
  const typeMap = {
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  }
  
  for (const [ext, mimeType] of Object.entries(typeMap)) {
    if (name.endsWith(ext) && type === mimeType) {
      return true
    }
  }
  
  return false
}

/**
 * Validates image file before upload
 * @param {File} file - File object to validate
 * @param {object} options - Validation options
 * @returns {object} { valid: boolean, error: string | null }
 */
export function validateImageFile(file, options = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp']
  } = options

  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (!isValidImageType(file, allowedTypes)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  const sizeMB = getFileSizeMB(file)
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeMB}MB`
    }
  }

  return { valid: true, error: null }
}

/**
 * Loads image and returns dimensions
 * @param {string} imageSrc - Image URL or data URL
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export function getImageDimensions(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    // Handle CORS issues for cross-origin images
    img.crossOrigin = 'anonymous'
    img.src = imageSrc
  })
}

/**
 * Checks if image has valid dimensions
 * @param {string} imageSrc - Image URL or data URL
 * @param {number} minWidth - Minimum width in pixels
 * @param {number} minHeight - Minimum height in pixels
 * @returns {Promise<boolean>} True if image dimensions are valid
 */
export async function validateImageDimensions(imageSrc, minWidth = 100, minHeight = 100) {
  try {
    const dimensions = await getImageDimensions(imageSrc)
    return dimensions.width >= minWidth && dimensions.height >= minHeight
  } catch (error) {
    console.error('Failed to validate image dimensions:', error)
    return false
  }
}
