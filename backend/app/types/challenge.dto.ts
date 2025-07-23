export interface CreateChallengeDTO {
  name: string
  description?: string
  objectives?: string
  recommendedExercises?: string
  duration?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  isPublic?: boolean
  type?: string
  score?: number
}

export interface UpdateChallengeDTO {
  name?: string
  description?: string
  objectives?: string
  recommendedExercises?: string
  duration?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  isPublic?: boolean
  type?: string
  score?: number
}

export interface ChallengeData {
  id: number
  name: string
  description?: string
  objectives?: string
  recommendedExercises?: string
  duration?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  isPublic: boolean
  type?: string
  score?: number
  gymId?: number
  creatorId?: number
  creatorType: 'user' | 'gym'
  createdAt: string
  updatedAt: string
}

export interface ChallengeFilterOptions {
  difficulty?: 'easy' | 'medium' | 'hard'
  type?: string
  minDuration?: number
  maxDuration?: number
  creatorType?: 'user' | 'gym'
  isPublic?: boolean
}
