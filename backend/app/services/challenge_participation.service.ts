import { ChallengeParticipationRepository } from '../repositories/challenge_participation.repository.js'
import { ChallengeService } from './challenge_service.js'
import { UserService } from './user.service.js'
import {
  ChallengeParticipationData,
  ClaimChallengeDTO,
} from '../types/challenge_participation.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'
import { DateTime } from 'luxon'

export class ChallengeParticipationService {
  private participationRepository: ChallengeParticipationRepository
  private challengeService: ChallengeService
  private userService: UserService

  constructor() {
    this.participationRepository = new ChallengeParticipationRepository()
    this.challengeService = new ChallengeService()
    this.userService = new UserService()
  }

  async startChallenge(
    userId: number,
    challengeId: number
  ): Promise<ServiceResponse<ChallengeParticipationData>> {
    try {
      // Verify challenge exists
      const challengeResult = await this.challengeService.getChallengeById(challengeId)
      if (!challengeResult.success) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      // Check if user already participates
      const existingParticipation = await this.participationRepository.findByUserAndChallenge(
        userId,
        challengeId
      )
      if (existingParticipation) {
        throw new ServiceException(
          'User already participating in this challenge',
          'ALREADY_PARTICIPATING',
          409
        )
      }

      const participation = await this.participationRepository.create({
        challengeId,
        userId,
        status: 'in_progress',
        startedAt: DateTime.now(),
      })

      return {
        success: true,
        data: this.formatParticipationData(participation),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to start challenge', 'START_CHALLENGE_ERROR', 500)
    }
  }

  async claimChallenge(
    userId: number,
    challengeId: number,
    claimData: ClaimChallengeDTO
  ): Promise<ServiceResponse<ChallengeParticipationData>> {
    try {
      // Find existing participation
      const participation = await this.participationRepository.findByUserAndChallenge(
        userId,
        challengeId
      )
      if (!participation) {
        throw new ServiceException(
          'No participation found for this challenge',
          'PARTICIPATION_NOT_FOUND',
          404
        )
      }

      if (participation.status === 'completed') {
        throw new ServiceException('Challenge already completed', 'ALREADY_COMPLETED', 409)
      }

      // Get challenge details for scoring
      const challengeResult = await this.challengeService.getChallengeById(challengeId)
      if (!challengeResult.success || !challengeResult.data) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      const challenge = challengeResult.data
      const completedAt = claimData.completedAt
        ? DateTime.fromISO(claimData.completedAt)
        : DateTime.now()

      // Update participation status
      const updatedParticipation = await this.participationRepository.update(participation.id, {
        status: 'completed',
        completedAt,
        score: challenge.score || 0,
        notes: claimData.notes,
      })

      if (!updatedParticipation) {
        throw new ServiceException('Failed to update participation', 'UPDATE_ERROR', 500)
      }

      // Award points to user if challenge has score
      if (challenge.score && challenge.score > 0) {
        await this.awardChallengePoints(userId, challenge.score)
      }

      return {
        success: true,
        data: this.formatParticipationData(updatedParticipation),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to claim challenge', 'CLAIM_CHALLENGE_ERROR', 500)
    }
  }

  async getUserParticipations(
    userId: number,
    status?: string
  ): Promise<ServiceResponse<ChallengeParticipationData[]>> {
    try {
      const participations = await this.participationRepository.findUserParticipations(
        userId,
        status
      )

      return {
        success: true,
        data: participations.map((p) => this.formatParticipationData(p)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch user participations', 'FETCH_ERROR', 500)
    }
  }

  async getChallengeParticipations(
    challengeId: number
  ): Promise<ServiceResponse<ChallengeParticipationData[]>> {
    try {
      const participations =
        await this.participationRepository.findChallengeParticipations(challengeId)

      return {
        success: true,
        data: participations.map((p) => this.formatParticipationData(p)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch challenge participations', 'FETCH_ERROR', 500)
    }
  }

  async getUserChallengeStats(userId: number): Promise<
    ServiceResponse<{
      total: number
      completed: number
      inProgress: number
      abandoned: number
    }>
  > {
    try {
      const allParticipations = await this.participationRepository.findUserParticipations(userId)

      const stats = {
        total: allParticipations.length,
        completed: allParticipations.filter((p) => p.status === 'completed').length,
        inProgress: allParticipations.filter((p) => p.status === 'in_progress').length,
        abandoned: allParticipations.filter((p) => p.status === 'abandoned').length,
      }

      return {
        success: true,
        data: stats,
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch user challenge stats', 'STATS_ERROR', 500)
    }
  }

  private async awardChallengePoints(userId: number, points: number): Promise<void> {
    try {
      // Simple point awarding - could be enhanced with level progression
      const userResult = await this.userService.getUserById(userId)
      if (userResult.success && userResult.data) {
        // This would require extending UserService with point management
        // For now, we'll log the achievement
        console.log(`User ${userId} earned ${points} points from challenge completion`)
      }
    } catch (error) {
      // Don't fail the whole operation if point awarding fails
      console.error('Failed to award points:', error)
    }
  }

  private formatParticipationData(participation: any): ChallengeParticipationData {
    return {
      id: participation.id,
      challengeId: participation.challengeId,
      userId: participation.userId,
      status: participation.status,
      startedAt: participation.startedAt.toISO(),
      completedAt: participation.completedAt?.toISO() || undefined,
      score: participation.score,
      notes: participation.notes,
      createdAt: participation.createdAt.toISO(),
      updatedAt: participation.updatedAt.toISO(),
    }
  }
}
