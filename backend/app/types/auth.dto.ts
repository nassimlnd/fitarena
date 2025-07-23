export interface AuthContext {
  userId: number
  role: 'user' | 'gymOwner' | 'admin'
}

export interface OwnershipValidation {
  isOwner: boolean
  resourceId?: number
  message?: string
}

export interface PermissionCheck {
  hasPermission: boolean
  reason?: string
}
