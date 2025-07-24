export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  role?: 'admin' | 'gymOwner' | 'user'
}

export interface AuthToken {
  accessToken: string
}

export interface UserData {
  id: number
  fullName: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}
