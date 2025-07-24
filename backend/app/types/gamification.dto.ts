export interface UserGamificationData {
  totalPoints: number
  availablePoints: number
  level: number
  experiencePoints: number
  achievementsProgress: Record<string, any> | null
  badges: BadgeProgressData[]
  rewards: RewardClaimedData[]
  leaderboardPosition?: number
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

export interface LevelProgressData {
  currentLevel: number
  currentXP: number
  nextLevelXP: number
  progressToNext: number // 0-100 percentage
  levelRewards?: RewardClaimedData[]
}

export interface LeaderboardEntry {
  userId: number
  fullName: string | null
  level: number
  totalPoints: number
  badgeCount: number
  rank: number
}

export interface GamificationEvent {
  type: 'training_completed' | 'challenge_completed' | 'streak_achieved' | 'level_up' | 'custom'
  userId: number
  data: Record<string, any>
  timestamp: string
}
