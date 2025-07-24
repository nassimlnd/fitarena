import { UserRepository } from '../repositories/user_repository.js'
import { BadgeRepository } from '../repositories/badge_repository.js'
import { TrainingSessionRepository } from '../repositories/training_session_repository.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export interface LeaderboardEntry {
  userId: number
  fullName: string | null
  sessionsCount: number
  badgesCount: number
  totalCalories: number
  activityScore: number // Score combiné d'activité
  rank: number
}

export class LeaderboardService {
  private userRepository: UserRepository
  private badgeRepository: BadgeRepository
  private trainingRepository: TrainingSessionRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.badgeRepository = new BadgeRepository()
    this.trainingRepository = new TrainingSessionRepository()
  }

  async getActivityLeaderboard(limit: number = 50): Promise<ServiceResponse<LeaderboardEntry[]>> {
    try {
      // Récupérer tous les utilisateurs actifs (exclure les admin)
      const users = await this.userRepository.findMany(
        {},
        { limit: limit * 2 } // Prendre plus pour filtrer les inactifs
      )

      const leaderboardEntries: LeaderboardEntry[] = []

      for (const user of users) {
        // Compter les sessions d'entraînement
        const sessions = await this.trainingRepository.findMany({ userId: user.id })
        const sessionsCount = sessions.length

        // Compter les badges obtenus
        const badges = await this.badgeRepository.findUserBadges(user.id)
        const badgesCount = badges.length

        // Calculer les calories totales
        const stats = await this.trainingRepository.getUserStats(user.id)
        const totalCalories = stats.totalCalories

        // Calculer le score d'activité selon le cahier des charges
        // "Classements des utilisateurs les plus actifs"
        const activityScore = this.calculateActivityScore(sessionsCount, badgesCount, totalCalories)

        // Ajouter seulement les utilisateurs non-admin avec au moins 1 session
        if (user.role !== 'admin' && sessionsCount > 0) {
          leaderboardEntries.push({
            userId: user.id,
            fullName: user.fullName,
            sessionsCount,
            badgesCount,
            totalCalories,
            activityScore,
            rank: 0, // Sera calculé après tri
          })
        }
      }

      // Trier par score d'activité décroissant
      leaderboardEntries.sort((a, b) => b.activityScore - a.activityScore)

      // Assigner les rangs et limiter les résultats
      const finalLeaderboard = leaderboardEntries.slice(0, limit).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))

      return {
        success: true,
        data: finalLeaderboard,
      }
    } catch (error) {
      throw new ServiceException(
        'Failed to fetch activity leaderboard',
        'LEADERBOARD_FETCH_FAILED',
        500
      )
    }
  }

  async getUserRank(userId: number): Promise<
    ServiceResponse<{
      rank: number | null
      totalUsers: number
      userStats: {
        sessionsCount: number
        badgesCount: number
        totalCalories: number
        activityScore: number
      }
    }>
  > {
    try {
      // Obtenir le leaderboard complet
      const leaderboardResult = await this.getActivityLeaderboard(1000)

      if (!leaderboardResult.success || !leaderboardResult.data) {
        throw new ServiceException(
          'Failed to get leaderboard for ranking',
          'LEADERBOARD_ERROR',
          500
        )
      }

      const leaderboard = leaderboardResult.data
      const userEntry = leaderboard.find((entry) => entry.userId === userId)

      // Si l'utilisateur n'est pas dans le leaderboard, calculer ses stats
      let userStats = {
        sessionsCount: 0,
        badgesCount: 0,
        totalCalories: 0,
        activityScore: 0,
      }

      if (userEntry) {
        userStats = {
          sessionsCount: userEntry.sessionsCount,
          badgesCount: userEntry.badgesCount,
          totalCalories: userEntry.totalCalories,
          activityScore: userEntry.activityScore,
        }
      } else {
        // Calculer les stats pour un utilisateur non classé
        const sessions = await this.trainingRepository.findMany({ userId })
        const badges = await this.badgeRepository.findUserBadges(userId)
        const stats = await this.trainingRepository.getUserStats(userId)

        userStats = {
          sessionsCount: sessions.length,
          badgesCount: badges.length,
          totalCalories: stats.totalCalories,
          activityScore: this.calculateActivityScore(
            sessions.length,
            badges.length,
            stats.totalCalories
          ),
        }
      }

      return {
        success: true,
        data: {
          rank: userEntry?.rank || null,
          totalUsers: leaderboard.length,
          userStats,
        },
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to get user rank', 'USER_RANK_FETCH_FAILED', 500)
    }
  }

  /**
   * Calcule le score d'activité d'un utilisateur
   * Basé sur : sessions d'entraînement, badges obtenus, calories brûlées
   */
  private calculateActivityScore(
    sessionsCount: number,
    badgesCount: number,
    totalCalories: number
  ): number {
    // Formule de score d'activité selon l'importance
    const sessionWeight = 10 // 10 points par session
    const badgeWeight = 25 // 25 points par badge (accomplissements)
    const calorieWeight = 0.01 // 0.01 point par calorie

    return sessionsCount * sessionWeight + badgesCount * badgeWeight + totalCalories * calorieWeight
  }
}
