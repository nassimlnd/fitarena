import type { HttpContext } from '@adonisjs/core/http'
import { LeaderboardService } from '../services/leaderboard_service.js'
import { BaseController } from './base_controller.js'

export default class LeaderboardController extends BaseController {
  private leaderboardService = new LeaderboardService()

  /**
   * Classement des utilisateurs les plus actifs (selon cahier des charges ligne 98)
   */
  async index({ request, response }: HttpContext) {
    try {
      const limit = Number(request.qs().limit) || 50
      const result = await this.leaderboardService.getActivityLeaderboard(limit)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Position de l'utilisateur connecté dans le classement
   */
  async myRank({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.leaderboardService.getUserRank(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
