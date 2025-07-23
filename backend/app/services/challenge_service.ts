import { ChallengeRepository } from '../repositories/challenge_repository.js'
import { GymRepository } from '../repositories/gym_repository.js'
import { CreateChallengeDTO, UpdateChallengeDTO, ChallengeData, ChallengeFilterOptions } from '../types/challenge.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class ChallengeService {
  private challengeRepository: ChallengeRepository
  private gymRepository: GymRepository

  constructor() {
    this.challengeRepository = new ChallengeRepository()
    this.gymRepository = new GymRepository()
  }

  async createUserChallenge(data: CreateChallengeDTO, userId: number): Promise<ServiceResponse<ChallengeData>> {
    try {
      // Valider les données spécifiques aux user challenges
      this.validateUserChallengeData(data)

      const challengeData = {
        ...data,
        creatorId: userId,
        creatorType: 'user' as const,
        gymId: null, // S'assurer que gymId est null pour les user challenges
      }

      const challenge = await this.challengeRepository.create(challengeData)

      return {
        success: true,
        data: this.formatChallengeData(challenge),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to create user challenge', 'CHALLENGE_CREATION_FAILED', 500)
    }
  }

  async createGymChallenge(data: CreateChallengeDTO, userId: number): Promise<ServiceResponse<ChallengeData>> {
    try {
      // Vérifier que l'utilisateur possède une salle
      const gym = await this.gymRepository.findByOwner(userId)
      if (!gym) {
        throw new ServiceException('You must own a gym to create gym challenges', 'GYM_NOT_OWNED', 403)
      }

      // Vérifier que la salle est approuvée
      if (gym.status !== 'approved') {
        throw new ServiceException('Your gym must be approved to create challenges', 'GYM_NOT_APPROVED', 403)
      }

      // Valider les données spécifiques aux gym challenges
      this.validateGymChallengeData(data)

      const challengeData = {
        ...data,
        gymId: gym.id,
        creatorType: 'gym' as const,
        creatorId: null, // S'assurer que creatorId est null pour les gym challenges
      }

      const challenge = await this.challengeRepository.create(challengeData)

      return {
        success: true,
        data: this.formatChallengeData(challenge),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ServiceException('A challenge with this name already exists for your gym', 'CHALLENGE_DUPLICATE', 409)
      }

      throw new ServiceException('Failed to create gym challenge', 'CHALLENGE_CREATION_FAILED', 500)
    }
  }

  async getUserChallenges(filters?: ChallengeFilterOptions): Promise<ServiceResponse<ChallengeData[]>> {
    try {
      // Forcer les filtres pour les user challenges publics
      const userFilters = {
        ...filters,
        creatorType: 'user' as const,
        isPublic: true,
      }

      const challenges = await this.challengeRepository.findWithFilters(userFilters)

      return {
        success: true,
        data: challenges.map(challenge => this.formatChallengeData(challenge)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch user challenges', 'CHALLENGE_FETCH_FAILED', 500)
    }
  }

  async getGymChallenges(gymId?: number): Promise<ServiceResponse<ChallengeData[]>> {
    try {
      const challenges = await this.challengeRepository.findGymChallenges(gymId)

      return {
        success: true,
        data: challenges.map(challenge => this.formatChallengeData(challenge)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch gym challenges', 'CHALLENGE_FETCH_FAILED', 500)
    }
  }

  async getChallengeById(challengeId: number): Promise<ServiceResponse<ChallengeData>> {
    try {
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatChallengeData(challenge),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch challenge', 'CHALLENGE_FETCH_FAILED', 500)
    }
  }

  async updateChallenge(
    challengeId: number,
    data: UpdateChallengeDTO,
    userId: number,
    userRole: string
  ): Promise<ServiceResponse<ChallengeData>> {
    try {
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      // Vérifier l'ownership selon le type de challenge
      const hasOwnership = await this.validateChallengeOwnership(challengeId, userId, userRole)
      if (!hasOwnership) {
        throw new ServiceException('You are not authorized to update this challenge', 'CHALLENGE_UNAUTHORIZED', 403)
      }

      const updatedChallenge = await this.challengeRepository.update(challengeId, data)
      if (!updatedChallenge) {
        throw new ServiceException('Failed to update challenge', 'CHALLENGE_UPDATE_FAILED', 500)
      }

      return {
        success: true,
        data: this.formatChallengeData(updatedChallenge),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to update challenge', 'CHALLENGE_UPDATE_FAILED', 500)
    }
  }

  async deleteChallenge(challengeId: number, userId: number, userRole: string): Promise<ServiceResponse<boolean>> {
    try {
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      // Vérifier l'ownership
      const hasOwnership = await this.validateChallengeOwnership(challengeId, userId, userRole)
      if (!hasOwnership) {
        throw new ServiceException('You are not authorized to delete this challenge', 'CHALLENGE_UNAUTHORIZED', 403)
      }

      const deleted = await this.challengeRepository.delete(challengeId)
      if (!deleted) {
        throw new ServiceException('Failed to delete challenge', 'CHALLENGE_DELETE_FAILED', 500)
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to delete challenge', 'CHALLENGE_DELETE_FAILED', 500)
    }
  }

  async validateChallengeOwnership(challengeId: number, userId: number, userRole: string): Promise<boolean> {
    try {
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) return false

      if (challenge.creatorType === 'user') {
        return challenge.creatorId === userId
      } else {
        // Pour les gym challenges, vérifier que l'utilisateur possède la salle
        if (userRole !== 'gymOwner') return false
        
        const gym = await this.gymRepository.findById(challenge.gymId!)
        return gym?.ownerId === userId
      }
    } catch (error) {
      return false
    }
  }

  private validateUserChallengeData(data: CreateChallengeDTO): void {
    if (!data.name || data.name.length < 3) {
      throw new ServiceException('Challenge name must be at least 3 characters', 'INVALID_CHALLENGE_NAME', 422)
    }

    if (!data.description || data.description.length < 10) {
      throw new ServiceException('Challenge description must be at least 10 characters', 'INVALID_CHALLENGE_DESCRIPTION', 422)
    }

    if (!data.objectives || data.objectives.length < 5) {
      throw new ServiceException('Challenge objectives must be at least 5 characters', 'INVALID_CHALLENGE_OBJECTIVES', 422)
    }

    if (!data.duration || data.duration < 1) {
      throw new ServiceException('Challenge duration must be at least 1 day', 'INVALID_CHALLENGE_DURATION', 422)
    }
  }

  private validateGymChallengeData(data: CreateChallengeDTO): void {
    if (!data.name || data.name.length < 2) {
      throw new ServiceException('Challenge name must be at least 2 characters', 'INVALID_CHALLENGE_NAME', 422)
    }

    if (data.score === undefined || data.score < 0) {
      throw new ServiceException('Challenge score must be provided and non-negative', 'INVALID_CHALLENGE_SCORE', 422)
    }
  }

  private formatChallengeData(challenge: any): ChallengeData {
    return {
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      objectives: challenge.objectives,
      recommendedExercises: challenge.recommendedExercises,
      duration: challenge.duration,
      difficulty: challenge.difficulty,
      isPublic: challenge.isPublic,
      type: challenge.type,
      score: challenge.score,
      gymId: challenge.gymId,
      creatorId: challenge.creatorId,
      creatorType: challenge.creatorType,
      createdAt: challenge.createdAt.toISO(),
      updatedAt: challenge.updatedAt.toISO(),
    }
  }
}