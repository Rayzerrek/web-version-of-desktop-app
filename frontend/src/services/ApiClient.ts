export const API_BASE = 'http://localhost:8000'

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()
  if (!response.ok) {
    // try to parse JSON error
    try {
      const json = contentType.includes('application/json') ? JSON.parse(text) : { message: text }
      throw new Error(json.message || JSON.stringify(json) || text)
    } catch (e) {
      throw new Error(text || response.statusText)
    }
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(text)
  }

  return text
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  return (await handleResponse(res)) as T
}

export function authHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}
