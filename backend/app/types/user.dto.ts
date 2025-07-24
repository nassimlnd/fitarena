export interface CreateUserDTO {
  fullName?: string
  email: string
  password: string
  role: 'admin' | 'gymOwner' | 'user'
}

export interface UpdateUserDTO {
  fullName?: string
  email?: string
  password?: string
  role?: 'admin' | 'gymOwner' | 'user'
  totalPoints?: number
  availablePoints?: number
  level?: number
  experiencePoints?: number
  achievementsProgress?: Record<string, any>
}

export interface UserData {
  id: number
  fullName: string | null
  email: string
  role: 'admin' | 'gymOwner' | 'user'
  totalPoints: number
  availablePoints: number
  level: number
  experiencePoints: number
  achievementsProgress: Record<string, any> | null
  createdAt: string
  updatedAt: string | null
  isActive: boolean
}

export interface UserFilterOptions {
  role?: 'admin' | 'gymOwner' | 'user'
  minLevel?: number
  maxLevel?: number
  minPoints?: number
}

// Alias for backward compatibility
export type UpdateUserData = UpdateUserDTO
