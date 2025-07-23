import { TrainingSessionRepository } from '../repositories/training_session_repository.js'
import { ChallengeRepository } from '../repositories/challenge_repository.js'
import {
  CreateTrainingSessionDTO,
  UpdateTrainingSessionDTO,
  TrainingSessionData,
  TrainingSessionFilterOptions,
  TrainingStatsData,
} from '../types/training_session.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'
import { DateTime } from 'luxon'

export class TrainingService {
  private trainingRepository: TrainingSessionRepository
  private challengeRepository: ChallengeRepository

  constructor() {
    this.trainingRepository = new TrainingSessionRepository()
    this.challengeRepository = new ChallengeRepository()
  }

  async createTrainingSession(
    data: CreateTrainingSessionDTO,
    userId: number
  ): Promise<ServiceResponse<TrainingSessionData>> {
    try {
      // Validation des données
      this.validateTrainingSessionData(data)

      // Vérifier que le challenge existe si spécifié
      if (data.challengeId) {
        const challenge = await this.challengeRepository.findById(data.challengeId)
        if (!challenge) {
          throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
        }
      }

      const sessionData = {
        ...data,
        userId,
      }

      const session = await this.trainingRepository.create(sessionData)

      return {
        success: true,
        data: this.formatTrainingSessionData(session),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException(
        'Failed to create training session',
        'TRAINING_SESSION_CREATION_FAILED',
        500
      )
    }
  }

  async getTrainingSession(
    sessionId: number,
    userId: number
  ): Promise<ServiceResponse<TrainingSessionData>> {
    try {
      const session = await this.trainingRepository.findById(sessionId)
      if (!session) {
        throw new ServiceException('Training session not found', 'TRAINING_SESSION_NOT_FOUND', 404)
      }

      // Vérifier que l'utilisateur peut accéder à cette session
      if (session.userId !== userId) {
        throw new ServiceException(
          'You are not authorized to view this training session',
          'TRAINING_SESSION_UNAUTHORIZED',
          403
        )
      }

      return {
        success: true,
        data: this.formatTrainingSessionData(session),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException(
        'Failed to fetch training session',
        'TRAINING_SESSION_FETCH_FAILED',
        500
      )
    }
  }

  async getUserTrainingSessions(
    userId: number,
    filters?: TrainingSessionFilterOptions
  ): Promise<ServiceResponse<TrainingSessionData[]>> {
    try {
      const userFilters = {
        ...filters,
        userId, // Force l'userId pour la sécurité
      }

      const sessions = await this.trainingRepository.findWithFilters(userFilters)

      return {
        success: true,
        data: sessions.map((session) => this.formatTrainingSessionData(session)),
      }
    } catch (error) {
      throw new ServiceException(
        'Failed to fetch user training sessions',
        'TRAINING_SESSION_FETCH_FAILED',
        500
      )
    }
  }

  async getChallengeTrainingSessions(
    challengeId: number
  ): Promise<ServiceResponse<TrainingSessionData[]>> {
    try {
      // Vérifier que le challenge existe
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      const sessions = await this.trainingRepository.findByChallenge(challengeId)

      return {
        success: true,
        data: sessions.map((session) => this.formatTrainingSessionData(session)),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException(
        'Failed to fetch challenge training sessions',
        'TRAINING_SESSION_FETCH_FAILED',
        500
      )
    }
  }

  async updateTrainingSession(
    sessionId: number,
    data: UpdateTrainingSessionDTO,
    userId: number
  ): Promise<ServiceResponse<TrainingSessionData>> {
    try {
      const session = await this.trainingRepository.findById(sessionId)
      if (!session) {
        throw new ServiceException('Training session not found', 'TRAINING_SESSION_NOT_FOUND', 404)
      }

      // Vérifier l'ownership
      if (session.userId !== userId) {
        throw new ServiceException(
          'You are not authorized to update this training session',
          'TRAINING_SESSION_UNAUTHORIZED',
          403
        )
      }

      // Validation des nouvelles données
      if (data.challengeId) {
        const challenge = await this.challengeRepository.findById(data.challengeId)
        if (!challenge) {
          throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
        }
      }

      const updatedSession = await this.trainingRepository.update(sessionId, data)
      if (!updatedSession) {
        throw new ServiceException(
          'Failed to update training session',
          'TRAINING_SESSION_UPDATE_FAILED',
          500
        )
      }

      return {
        success: true,
        data: this.formatTrainingSessionData(updatedSession),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException(
        'Failed to update training session',
        'TRAINING_SESSION_UPDATE_FAILED',
        500
      )
    }
  }

  async deleteTrainingSession(
    sessionId: number,
    userId: number
  ): Promise<ServiceResponse<boolean>> {
    try {
      const session = await this.trainingRepository.findById(sessionId)
      if (!session) {
        throw new ServiceException('Training session not found', 'TRAINING_SESSION_NOT_FOUND', 404)
      }

      // Vérifier l'ownership
      if (session.userId !== userId) {
        throw new ServiceException(
          'You are not authorized to delete this training session',
          'TRAINING_SESSION_UNAUTHORIZED',
          403
        )
      }

      const deleted = await this.trainingRepository.delete(sessionId)
      if (!deleted) {
        throw new ServiceException(
          'Failed to delete training session',
          'TRAINING_SESSION_DELETE_FAILED',
          500
        )
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException(
        'Failed to delete training session',
        'TRAINING_SESSION_DELETE_FAILED',
        500
      )
    }
  }

  async getUserTrainingStats(userId: number): Promise<ServiceResponse<TrainingStatsData>> {
    try {
      const stats = await this.trainingRepository.getUserStats(userId)

      const trainingStats: TrainingStatsData = {
        ...stats,
        averageDuration:
          stats.totalSessions > 0 ? Math.round(stats.totalDuration / stats.totalSessions) : 0,
        averageCalories:
          stats.totalSessions > 0 ? Math.round(stats.totalCalories / stats.totalSessions) : 0,
      }

      return {
        success: true,
        data: trainingStats,
      }
    } catch (error) {
      throw new ServiceException(
        'Failed to fetch training stats',
        'TRAINING_STATS_FETCH_FAILED',
        500
      )
    }
  }

  private validateTrainingSessionData(data: CreateTrainingSessionDTO): void {
    if (!data.date) {
      throw new ServiceException('Training date is required', 'INVALID_TRAINING_DATE', 422)
    }

    if (!data.duration || data.duration <= 0) {
      throw new ServiceException(
        'Training duration must be greater than 0',
        'INVALID_TRAINING_DURATION',
        422
      )
    }

    if (data.caloriesBurned !== undefined && data.caloriesBurned < 0) {
      throw new ServiceException(
        'Calories burned cannot be negative',
        'INVALID_CALORIES_BURNED',
        422
      )
    }

    // Vérifier que la date n'est pas dans le futur
    const trainingDate = typeof data.date === 'string' ? DateTime.fromISO(data.date) : data.date
    if (trainingDate > DateTime.now()) {
      throw new ServiceException(
        'Training date cannot be in the future',
        'INVALID_TRAINING_DATE',
        422
      )
    }
  }

  private formatTrainingSessionData(session: any): TrainingSessionData {
    return {
      id: session.id,
      userId: session.userId,
      challengeId: session.challengeId,
      date: session.date.toISO(),
      duration: session.duration,
      caloriesBurned: session.caloriesBurned,
      metrics: session.metrics,
      createdAt: session.createdAt.toISO(),
      updatedAt: session.updatedAt.toISO(),
    }
  }
}
