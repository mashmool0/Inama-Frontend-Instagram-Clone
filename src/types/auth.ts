export interface TokenPair {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  identifier: string
  password: string
}
