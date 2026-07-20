import axios from 'axios'

export function apiErrorMessage(error: unknown, fallback = 'خطایی رخ داد. دوباره تلاش کنید.') {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error || fallback
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}
