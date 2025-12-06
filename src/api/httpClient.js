const joinUrl = (base, path) => {
  if (!base) return path
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

const buildFetcher = (baseUrl) => {
  return async (path, options = {}) => {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const response = await fetch(joinUrl(baseUrl, path), {
      ...options,
      headers,
    })

    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      throw new Error('Session expired. Please log in again.')
    }

    const text = await response.text()
    let data = null
    if (text) {
      try {
        const parsed = JSON.parse(text)
        data = parsed?.data ?? parsed
      } catch {
        data = text // allow plain-text bodies (some APIs return raw tokens or messages)
      }
    }

    if (!response.ok) {
      const message =
        (typeof data === 'string' ? data : null) ||
        data?.message ||
        data?.error ||
        response.statusText
      throw new Error(message || 'Request failed')
    }

    return data
  }
}

// export const dotnetFetch = buildFetcher(
//   import.meta.env.VITE_DOTNET_API_BASE
// )

export const dotnetFetch = buildFetcher('/dotnet')


export const fastFetch = buildFetcher(import.meta.env.VITE_FASTAPI_BASE || '/fastapi')
