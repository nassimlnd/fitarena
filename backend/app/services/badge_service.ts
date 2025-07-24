import { BadgeRepository } from '../repositories/badge_repository.js'
import { UserRepository } from '../repositories/user_repository.js'
import { TrainingSessionRepository } from '../repositories/training_session_repository.js'
import {
  CreateBadgeDTO,
  UpdateBadgeDTO,
  BadgeData,
  BadgeCriteria,
  BadgeProgressData,
} from '../types/badge.dto.js'
import { UpdateUserData } from '../types/user.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'
import { GamificationEvent } from '../types/gamification.dto.js'

export class BadgeService {
  private badgeRepository: BadgeRepository
  private userRepository: UserRepository
  private trainingRepository: TrainingSessionRepository

  constructor() {
    this.badgeRepository = new BadgeRepository()
    this.userRepository = new UserRepository()
    this.trainingRepository = new TrainingSessionRepository()
  }

  async createBadge(data: CreateBadgeDTO): Promise<ServiceResponse<BadgeData>> {
    try {
      this.validateBadgeData(data)

      const badge = await this.badgeRepository.create(data)

      return {
        success: true,
        data: this.formatBadgeData(badge),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to create badge', 'BADGE_CREATION_FAILED', 500)
    }
  }

  async getBadge(badgeId: number): Promise<ServiceResponse<BadgeData>> {
    try {
      const badge = await this.badgeRepository.findById(badgeId)
      if (!badge) {
        throw new ServiceException('Badge not found', 'BADGE_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatBadgeData(badge),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to fetch badge', 'BADGE_FETCH_FAILED', 500)
    }
  }

  async getAllBadges(filters?: any): Promise<ServiceResponse<BadgeData[]>> {
    try {
      const badges = await this.badgeRepository.findMany(filters)

      return {
        success: true,
        data: badges.map((badge) => this.formatBadgeData(badge)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch badges', 'BADGES_FETCH_FAILED', 500)
    }
  }

  async updateBadge(badgeId: number, data: UpdateBadgeDTO): Promise<ServiceResponse<BadgeData>> {
    try {
      const badge = await this.badgeRepository.update(badgeId, data)
      if (!badge) {
        throw new ServiceException('Badge not found', 'BADGE_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatBadgeData(badge),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to update badge', 'BADGE_UPDATE_FAILED', 500)
    }
  }

  async deleteBadge(badgeId: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.badgeRepository.delete(badgeId)
      if (!deleted) {
        throw new ServiceException('Badge not found', 'BADGE_NOT_FOUND', 404)
      }

      return { success: true }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to delete badge', 'BADGE_DELETE_FAILED', 500)
    }
  }

  async getUserBadges(userId: number): Promise<ServiceResponse<BadgeData[]>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const badges = await this.badgeRepository.findUserBadges(userId)

      return {
        success: true,
        data: badges.map((badge) => this.formatBadgeData(badge)),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to fetch user badges', 'USER_BADGES_FETCH_FAILED', 500)
    }
  }

  async getUserBadgeProgress(userId: number): Promise<ServiceResponse<BadgeProgressData[]>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const allBadges = await this.badgeRepository.findActive()
      const userBadges = await this.badgeRepository.findUserBadges(userId)
      const userBadgeIds = userBadges.map((b) => b.id)

      const progressData: BadgeProgressData[] = []

      for (const badge of allBadges) {
        const isEarned = userBadgeIds.includes(badge.id)
        const earnedBadge = userBadges.find((ub) => ub.id === badge.id)

        let progress = 0
        let progressDetails = {}

        if (!isEarned) {
          const progressInfo = await this.calculateBadgeProgress(
            userId,
            badge.criteria as BadgeCriteria
          )
          progress = progressInfo.progress
          progressDetails = progressInfo.details
        }

        progressData.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: badge.color,
          type: badge.type,
          points: badge.points,
          isEarned,
          earnedAt: earnedBadge?.$extras?.earned_at,
          progress: isEarned ? 100 : progress,
          progressDetails: isEarned ? undefined : progressDetails,
        })
      }

      return {
        success: true,
        data: progressData,
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      console.log(error)
      throw new ServiceException(
        'Failed to fetch badge progress',
        'BADGE_PROGRESS_FETCH_FAILED',
        500
      )
    }
  }

  async processGamificationEvent(event: GamificationEvent): Promise<ServiceResponse<BadgeData[]>> {
    try {
      const earnedBadges: BadgeData[] = []
      const activeBadges = await this.badgeRepository.findActive()

      for (const badge of activeBadges) {
        const hasEarned = await this.badgeRepository.checkUserHasBadge(event.userId, badge.id)
        if (hasEarned) continue

        const shouldEarn = await this.evaluateBadgeCriteria(
          event.userId,
          badge.criteria as BadgeCriteria,
          event
        )

        if (shouldEarn) {
          const success = await this.badgeRepository.awardBadgeToUser(event.userId, badge.id, {
            event: event.type,
            eventData: event.data,
          })

          if (success) {
            earnedBadges.push(this.formatBadgeData(badge))
            await this.awardBadgePoints(event.userId, badge.points)
          }
        }
      }

      return {
        success: true,
        data: earnedBadges,
      }
    } catch (error) {
      throw new ServiceException(
        'Failed to process gamification event',
        'EVENT_PROCESSING_FAILED',
        500
      )
    }
  }

  private async evaluateBadgeCriteria(
    userId: number,
    criteria: BadgeCriteria,
    _event: GamificationEvent
  ): Promise<boolean> {
    switch (criteria.type) {
      case 'training_sessions':
        return await this.evaluateTrainingSessionsCriteria(userId, criteria)

      case 'challenges_completed':
        return await this.evaluateChallengesCompletedCriteria(userId, criteria)

      case 'calories_burned':
        return await this.evaluateCaloriesBurnedCriteria(userId, criteria)

      case 'streak':
        return await this.evaluateStreakCriteria(userId, criteria)

      case 'level':
        return await this.evaluateLevelCriteria(userId, criteria)

      default:
        return false
    }
  }

  private async evaluateTrainingSessionsCriteria(
    userId: number,
    criteria: BadgeCriteria
  ): Promise<boolean> {
    const stats = await this.trainingRepository.getUserStats(userId)

    switch (criteria.period) {
      case 'week':
        return stats.sessionsThisWeek >= criteria.target
      case 'month':
        return stats.sessionsThisMonth >= criteria.target
      default:
        return stats.totalSessions >= criteria.target
    }
  }

  private async evaluateChallengesCompletedCriteria(
    _userId: number,
    _criteria: BadgeCriteria
  ): Promise<boolean> {
    // This would need to be implemented based on your challenge completion tracking
    // For now, returning false as placeholder
    return false
  }

  private async evaluateCaloriesBurnedCriteria(
    userId: number,
    criteria: BadgeCriteria
  ): Promise<boolean> {
    const stats = await this.trainingRepository.getUserStats(userId)
    return stats.totalCalories >= criteria.target
  }

  private async evaluateStreakCriteria(
    _userId: number,
    _criteria: BadgeCriteria
  ): Promise<boolean> {
    // This would need streak calculation logic
    // For now, returning false as placeholder
    return false
  }

  private async evaluateLevelCriteria(userId: number, criteria: BadgeCriteria): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    return user ? user.level >= criteria.target : false
  }

  private async calculateBadgeProgress(
    userId: number,
    criteria: BadgeCriteria
  ): Promise<{ progress: number; details: Record<string, any> }> {
    let current = 0
    let details = {}

    switch (criteria.type) {
      case 'training_sessions':
        const stats = await this.trainingRepository.getUserStats(userId)
        current =
          criteria.period === 'week'
            ? stats.sessionsThisWeek
            : criteria.period === 'month'
              ? stats.sessionsThisMonth
              : stats.totalSessions
        details = { current, target: criteria.target, type: 'sessions' }
        break

      case 'calories_burned':
        const calorieStats = await this.trainingRepository.getUserStats(userId)
        current = calorieStats.totalCalories
        details = { current, target: criteria.target, type: 'calories' }
        break

      case 'level':
        const user = await this.userRepository.findById(userId)
        current = user?.level || 1
        details = { current, target: criteria.target, type: 'level' }
        break
    }

    const progress = criteria.target > 0 ? Math.min(100, (current / criteria.target) * 100) : 0

    return { progress, details }
  }

  private async awardBadgePoints(userId: number, points: number): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (user) {
      await this.userRepository.update(userId, {
        totalPoints: user.totalPoints + points,
        availablePoints: user.availablePoints + points,
        experiencePoints: user.experiencePoints + points,
      } as UpdateUserData)
    }
  }

  private validateBadgeData(data: CreateBadgeDTO): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ServiceException('Badge name is required', 'INVALID_BADGE_NAME', 400)
    }

    if (!data.criteria || Object.keys(data.criteria).length === 0) {
      throw new ServiceException('Badge criteria is required', 'INVALID_BADGE_CRITERIA', 400)
    }
  }

  private formatBadgeData(badge: any): BadgeData {
    return {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      type: badge.type,
      criteria: badge.criteria,
      points: badge.points,
      isActive: badge.isActive,
      createdAt: badge.createdAt.toISO(),
      updatedAt: badge.updatedAt.toISO(),
      earnedAt: badge.$extras?.earned_at,
      context: badge.$extras?.context ? JSON.parse(badge.$extras.context) : undefined,
    }
  }
}
