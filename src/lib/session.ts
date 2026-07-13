const pendingRegistrationKey = 'inama.pending-registration'

export interface PendingRegistrationPayload {
  phone: string
  username: string
  displayName: string
}

export function setPendingRegistration(payload: PendingRegistrationPayload) {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.setItem(pendingRegistrationKey, JSON.stringify(payload))
}

export function getPendingRegistration(): PendingRegistrationPayload | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.sessionStorage.getItem(pendingRegistrationKey)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as PendingRegistrationPayload
  } catch {
    return null
  }
}

export function clearPendingRegistration() {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.removeItem(pendingRegistrationKey)
}
