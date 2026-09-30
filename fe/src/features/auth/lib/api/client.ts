import { clearToken, getToken } from '../auth/token'

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, { ...init, headers })
  if (res.status === 401) {
    clearToken()
  }
  if (!res.ok) {
    throw new Error(`요청이 실패했습니다 (${res.status})`)
  }

  return (await res.json()) as T
}