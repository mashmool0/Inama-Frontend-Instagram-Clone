export interface TokenPair {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface RegisterRequest {
  phone: string
  password: string
}

export interface VerifyOtpRequest {
  phone: string
  code: string
}

export interface LoginRequest {
  phone: string
  password: string
}
