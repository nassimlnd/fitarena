import { DateTime } from 'luxon'

export interface CreateTrainingSessionDTO {
  challengeId?: number
  date: DateTime | string
  duration: number
  caloriesBurned?: number
  metrics?: Record<string, any>
}

export interface UpdateTrainingSessionDTO {
  challengeId?: number
  date?: DateTime | string
  duration?: number
  caloriesBurned?: number
  metrics?: Record<string, any>
}

export interface TrainingSessionData {
  id: number
  userId: number
  challengeId?: number
  date: string
  duration: number
  caloriesBurned: number
  metrics?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface TrainingSessionFilterOptions {
  userId?: number
  challengeId?: number
  dateFrom?: string
  dateTo?: string
  minDuration?: number
  maxDuration?: number
  minCalories?: number
  maxCalories?: number
}

export interface TrainingStatsData {
  totalSessions: number
  totalDuration: number
  totalCalories: number
  averageDuration: number
  averageCalories: number
  sessionsThisWeek: number
  sessionsThisMonth: number
}
