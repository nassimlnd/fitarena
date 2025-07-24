export interface CreateUserData {
  fullName?: string
  email: string
  password: string
  role: 'admin' | 'gymOwner' | 'user'
  isActive?: boolean
}

export interface UpdateUserData {
  fullName?: string
  email?: string
  password?: string
  role?: 'admin' | 'gymOwner' | 'user'
  isActive?: boolean
}

export interface UserFilterOptions {
  role?: 'admin' | 'gymOwner' | 'user'
  isActive?: boolean
}
