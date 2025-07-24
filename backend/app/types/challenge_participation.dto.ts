export interface CreateChallengeParticipationDTO {
  challengeId: number
  userId: number
  status?: 'in_progress' | 'completed' | 'abandoned'
}

export interface UpdateChallengeParticipationDTO {
  status?: 'in_progress' | 'completed' | 'abandoned'
  completedAt?: string
  score?: number
  notes?: string
}

export interface ChallengeParticipationData {
  id: number
  challengeId: number
  userId: number
  status: 'in_progress' | 'completed' | 'abandoned'
  startedAt: string
  completedAt?: string
  score?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ClaimChallengeDTO {
  notes?: string
  completedAt?: string
}
