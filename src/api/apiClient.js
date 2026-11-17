const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'skill-vs-skill-token'

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

function getErrorMessage(data, status) {
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    const message = data.Message || data.message || data.error
    if (typeof message === 'string' && message.trim()) return message

    const validationErrors = Object.values(data.ModelState || data)
      .flat()
      .filter((value) => typeof value === 'string')
    if (validationErrors.length) return validationErrors.join(' ')
  }
  return `Request failed with status ${status}.`
}

export async function apiRequest(path, { token = getStoredToken(), ...options } = {}) {
  const headers = new Headers(options.headers)
  const isFormData = options.body instanceof FormData

  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) return null

  const responseText = await response.text()
  let data = null
  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = responseText
    }
  }

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, response.status))
    error.status = response.status
    throw error
  }

  return data
}
