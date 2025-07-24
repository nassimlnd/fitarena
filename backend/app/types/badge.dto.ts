export interface CreateBadgeDTO {
  name: string
  description?: string
  icon?: string
  color?: string
  type: 'achievement' | 'milestone' | 'special'
  criteria: Record<string, any>
  points?: number
}

export interface UpdateBadgeDTO {
  name?: string
  description?: string
  icon?: string
  color?: string
  type?: 'achievement' | 'milestone' | 'special'
  criteria?: Record<string, any>
  points?: number
  isActive?: boolean
}

export interface BadgeData {
  id: number
  name: string
  description: string | null
  icon: string | null
  color: string
  type: 'achievement' | 'milestone' | 'special'
  criteria: Record<string, any>
  points: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Optional relation data
  earnedAt?: string
  context?: Record<string, any>
}

export interface BadgeFilterOptions {
  type?: 'achievement' | 'milestone' | 'special'
  isActive?: boolean
  minPoints?: number
  maxPoints?: number
}

export interface BadgeCriteria {
  type:
    | 'training_sessions'
    | 'challenges_completed'
    | 'calories_burned'
    | 'streak'
    | 'level'
    | 'custom'
  target: number
  period?: 'day' | 'week' | 'month' | 'year' | 'all_time'
  conditions?: Record<string, any>
}

export interface BadgeProgressData {
  id: number
  name: string
  description: string | null
  icon: string | null
  color: string
  type: 'achievement' | 'milestone' | 'special'
  points: number
  isEarned: boolean
  earnedAt?: string
  progress?: number // 0-100 percentage
  progressDetails?: Record<string, any>
}
