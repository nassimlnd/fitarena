import { DateTime } from 'luxon'

export interface CreateChallengeParticipationData {
  challengeId: number
  userId: number
  status: 'in_progress' | 'completed' | 'abandoned'
  startedAt?: DateTime
  completedAt?: DateTime
  score?: number
  notes?: string
}

export interface UpdateChallengeParticipationData {
  status?: 'in_progress' | 'completed' | 'abandoned'
  completedAt?: DateTime
  score?: number
  notes?: string
}
