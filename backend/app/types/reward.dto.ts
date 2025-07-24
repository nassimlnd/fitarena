export interface CreateRewardDTO {
  name: string
  description?: string
  icon?: string
  type: 'virtual_item' | 'title' | 'access' | 'special'
  conditions: Record<string, any>
  pointsCost?: number
  isRepeatable?: boolean
}

export interface UpdateRewardDTO {
  name?: string
  description?: string
  icon?: string
  type?: 'virtual_item' | 'title' | 'access' | 'special'
  conditions?: Record<string, any>
  pointsCost?: number
  isActive?: boolean
  isRepeatable?: boolean
}

export interface RewardData {
  id: number
  name: string
  description: string | null
  icon: string | null
  type: 'virtual_item' | 'title' | 'access' | 'special'
  conditions: Record<string, any>
  pointsCost: number
  isActive: boolean
  isRepeatable: boolean
  createdAt: string
  updatedAt: string
  // Optional relation data
  claimedAt?: string
  context?: Record<string, any>
  isClaimedActive?: boolean
}

export interface RewardFilterOptions {
  type?: 'virtual_item' | 'title' | 'access' | 'special'
  isActive?: boolean
  maxPointsCost?: number
  isRepeatable?: boolean
}

export interface RewardConditions {
  type: 'level' | 'badges' | 'points' | 'achievements' | 'custom'
  requirements: Record<string, any>
}

export interface RewardClaimedData {
  id: number
  name: string
  description: string | null
  icon: string | null
  type: 'virtual_item' | 'title' | 'access' | 'special'
  pointsCost: number
  isClaimed: boolean
  claimedAt?: string
  isActive?: boolean
}
