import { UserRepository } from '../repositories/user_repository.js'
import { BadgeRepository } from '../repositories/badge_repository.js'
import { TrainingSessionRepository } from '../repositories/training_session_repository.js'
import {
  UserGamificationData,
  LevelProgressData,
  LeaderboardEntry,
  GamificationEvent,
} from '../types/gamification.dto.js'
import { UpdateUserData } from '../types/user.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'
import { BadgeService } from './badge_service.js'
import { DateTime } from 'luxon'

export class AchievementService {
  private userRepository: UserRepository
  private badgeRepository: BadgeRepository
  private trainingRepository: TrainingSessionRepository
  private badgeService: BadgeService

  // Level progression configuration
  private readonly LEVEL_XP_REQUIREMENTS = [
    0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000, 13000, 16500, 20500, 25000, 30000,
    36000, 42500, 49500, 57000, 65000,
  ]

  constructor() {
    this.userRepository = new UserRepository()
    this.badgeRepository = new BadgeRepository()
    this.trainingRepository = new TrainingSessionRepository()
    this.badgeService = new BadgeService()
  }

  async getUserGamificationData(userId: number): Promise<ServiceResponse<UserGamificationData>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const badgeProgress = await this.badgeService.getUserBadgeProgress(userId)
      const userRewards = await this.getUserRewardsForGamification(userId)
      const leaderboardPosition = await this.getUserLeaderboardPosition(userId)

      const gamificationData: UserGamificationData = {
        totalPoints: user.totalPoints,
        availablePoints: user.availablePoints,
        level: user.level,
        experiencePoints: user.experiencePoints,
        achievementsProgress: user.achievementsProgress,
        badges: badgeProgress.data || [],
        rewards: userRewards,
        leaderboardPosition,
      }

      return {
        success: true,
        data: gamificationData,
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException(
        'Failed to fetch gamification data',
        'GAMIFICATION_DATA_FETCH_FAILED',
        500
      )
    }
  }

  async getLevelProgress(userId: number): Promise<ServiceResponse<LevelProgressData>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const currentLevel = user.level
      const currentXP = user.experiencePoints
      const nextLevelXP = this.getXPRequiredForLevel(currentLevel + 1)
      const currentLevelXP = this.getXPRequiredForLevel(currentLevel)

      const progressToNext =
        nextLevelXP > currentLevelXP
          ? ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
          : 100

      const levelProgress: LevelProgressData = {
        currentLevel,
        currentXP,
        nextLevelXP,
        progressToNext: Math.max(0, Math.min(100, progressToNext)),
      }

      return {
        success: true,
        data: levelProgress,
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException(
        'Failed to fetch level progress',
        'LEVEL_PROGRESS_FETCH_FAILED',
        500
      )
    }
  }

  async getGlobalLeaderboard(limit: number = 50): Promise<ServiceResponse<LeaderboardEntry[]>> {
    try {
      const users = await this.userRepository.findMany({ role: 'user' }, { limit })

      const enrichedUsers = await Promise.all(
        users.map(async (user, index) => {
          const badges = await this.badgeRepository.findUserBadges(user.id)

          return {
            userId: user.id,
            fullName: user.fullName,
            level: user.level,
            totalPoints: user.totalPoints,
            badgeCount: badges.length,
            rank: index + 1,
          }
        })
      )

      // Sort by total points descending, then by level, then by badges
      const sortedLeaderboard = enrichedUsers.sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
        if (b.level !== a.level) return b.level - a.level
        return b.badgeCount - a.badgeCount
      })

      // Update ranks after sorting
      sortedLeaderboard.forEach((entry, index) => {
        entry.rank = index + 1
      })

      return {
        success: true,
        data: sortedLeaderboard,
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch leaderboard', 'LEADERBOARD_FETCH_FAILED', 500)
    }
  }

  async processUserAction(
    userId: number,
    actionType: 'training_completed' | 'challenge_completed' | 'login' | 'custom',
    actionData: Record<string, any> = {}
  ): Promise<
    ServiceResponse<{
      xpGained: number
      leveledUp: boolean
      newLevel?: number
      badgesEarned: any[]
    }>
  > {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      // Calculate XP gain based on action
      const xpGain = this.calculateXPGain(actionType, actionData)

      // Update user XP and check for level up
      const newXP = user.experiencePoints + xpGain
      const newLevel = this.calculateLevelFromXP(newXP)
      const leveledUp = newLevel > user.level

      // Update user data
      const updateData: any = {
        experiencePoints: newXP,
        level: newLevel,
      }

      // Award level-up bonuses
      if (leveledUp) {
        const levelBonus = this.calculateLevelUpBonus(newLevel)
        updateData.totalPoints = user.totalPoints + levelBonus
        updateData.availablePoints = user.availablePoints + levelBonus
      }

      await this.userRepository.update(userId, updateData)

      // Create gamification event for badge processing
      const event: GamificationEvent = {
        type: actionType === 'login' ? 'custom' : actionType,
        userId,
        data: {
          ...actionData,
          xpGained: xpGain,
          leveledUp,
          newLevel: leveledUp ? newLevel : undefined,
        },
        timestamp: DateTime.now().toISO(),
      }

      // Process badges
      const badgeResult = await this.badgeService.processGamificationEvent(event)

      return {
        success: true,
        data: {
          xpGained: xpGain,
          leveledUp,
          newLevel: leveledUp ? newLevel : undefined,
          badgesEarned: badgeResult.data || [],
        },
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to process user action', 'ACTION_PROCESSING_FAILED', 500)
    }
  }

  async updateAchievementProgress(
    userId: number,
    achievementKey: string,
    progress: Record<string, any>
  ): Promise<ServiceResponse<void>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const currentProgress = user.achievementsProgress || {}
      currentProgress[achievementKey] = {
        ...currentProgress[achievementKey],
        ...progress,
        lastUpdated: DateTime.now().toISO(),
      }

      await this.userRepository.update(userId, {
        achievementsProgress: currentProgress,
      } as UpdateUserData)

      return { success: true }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException(
        'Failed to update achievement progress',
        'ACHIEVEMENT_UPDATE_FAILED',
        500
      )
    }
  }

  async getUserStreak(userId: number): Promise<
    ServiceResponse<{
      currentStreak: number
      longestStreak: number
      lastActivityDate: string | null
    }>
  > {
    try {
      // Get user's training sessions ordered by date
      const sessions = await this.trainingRepository.findMany(
        { userId },
        { limit: 365 } // Get last year of data
      )

      if (sessions.length === 0) {
        return {
          success: true,
          data: {
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
          },
        }
      }

      // Calculate streaks
      const streakData = this.calculateStreaks(sessions)

      return {
        success: true,
        data: streakData,
      }
    } catch (error) {
      throw new ServiceException(
        'Failed to calculate user streak',
        'STREAK_CALCULATION_FAILED',
        500
      )
    }
  }

  private calculateXPGain(actionType: string, actionData: Record<string, any>): number {
    switch (actionType) {
      case 'training_completed':
        const baseXP = 10
        const durationBonus = Math.floor((actionData.duration || 0) / 10) // 1 XP per 10 minutes
        const caloriesBonus = Math.floor((actionData.caloriesBurned || 0) / 50) // 1 XP per 50 calories
        return baseXP + durationBonus + caloriesBonus

      case 'challenge_completed':
        return 50 // Higher XP for completing challenges

      case 'login':
        return 5 // Small XP for daily login

      default:
        return actionData.xp || 0
    }
  }

  private calculateLevelFromXP(xp: number): number {
    for (let level = this.LEVEL_XP_REQUIREMENTS.length - 1; level >= 1; level--) {
      if (xp >= this.LEVEL_XP_REQUIREMENTS[level]) {
        return level
      }
    }
    return 1
  }

  private getXPRequiredForLevel(level: number): number {
    if (level <= 0) return 0
    if (level >= this.LEVEL_XP_REQUIREMENTS.length) {
      // For levels beyond our table, use exponential growth
      const lastLevel = this.LEVEL_XP_REQUIREMENTS.length - 1
      const lastXP = this.LEVEL_XP_REQUIREMENTS[lastLevel]
      const levelsBeyon = level - lastLevel
      return lastXP + levelsBeyon * 10000 // 10k XP per level beyond table
    }
    return this.LEVEL_XP_REQUIREMENTS[level]
  }

  private calculateLevelUpBonus(level: number): number {
    return level * 50 // 50 points per level
  }

  private calculateStreaks(sessions: any[]): {
    currentStreak: number
    longestStreak: number
    lastActivityDate: string | null
  } {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastActivityDate: null }
    }

    // Group sessions by date
    const sessionsByDate = new Map<string, boolean>()
    sessions.forEach((session) => {
      const date = DateTime.fromJSDate(session.date).toISODate()
      if (date !== null) {
        sessionsByDate.set(date, true)
      }
    })

    // Sort dates
    const dates = Array.from(sessionsByDate.keys()).sort()

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate: DateTime | null = null

    const today = DateTime.now()

    // Calculate current streak (working backwards from today)
    let checkDate = today
    while (checkDate.diffNow('days').days >= -365) {
      // Check up to a year back
      const dateStr = checkDate.toISODate()
      if (dateStr !== null && sessionsByDate.has(dateStr)) {
        if (currentStreak === 0) {
          // Starting current streak calculation
          const daysDiff = Math.abs(today.diff(checkDate, 'days').days)
          if (daysDiff <= 1) {
            // Today or yesterday
            currentStreak = 1
          }
        } else {
          currentStreak++
        }
        checkDate = checkDate.minus({ days: 1 })
      } else {
        if (currentStreak > 0) break // End of current streak
        checkDate = checkDate.minus({ days: 1 })
      }
    }

    // Calculate longest streak
    for (const dateStr of dates) {
      const currentDate = DateTime.fromISO(dateStr)

      if (lastDate && currentDate.diff(lastDate, 'days').days === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }

      lastDate = currentDate
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    return {
      currentStreak,
      longestStreak,
      lastActivityDate: dates.length > 0 ? dates[dates.length - 1] : null,
    }
  }

  private async getUserRewardsForGamification(_userId: number): Promise<any[]> {
    // This would integrate with RewardService
    // For now returning empty array as placeholder
    return []
  }

  private async getUserLeaderboardPosition(userId: number): Promise<number | undefined> {
    try {
      const leaderboard = await this.getGlobalLeaderboard(1000) // Get top 1000
      const position = leaderboard.data?.findIndex((entry) => entry.userId === userId)
      return position !== undefined && position >= 0 ? position + 1 : undefined
    } catch {
      return undefined
    }
  }
}
