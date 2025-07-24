import type { HttpContext } from '@adonisjs/core/http'
import { AchievementService } from '../services/achievement_service.js'
import { BadgeService } from '../services/badge_service.js'
import { RewardService } from '../services/reward_service.js'
import { BaseController } from './base_controller.js'

export default class GamificationController extends BaseController {
  private achievementService = new AchievementService()
  private badgeService = new BadgeService()
  private rewardService = new RewardService()

  async dashboard({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.achievementService.getUserGamificationData(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async badges({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.badgeService.getUserBadgeProgress(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async myBadges({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.badgeService.getUserBadges(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async rewards({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.rewardService.getAvailableRewards(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async myRewards({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.rewardService.getUserRewards(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async claimReward({ params, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const rewardId = this.getValidId(params.id, 'reward ID')

      const result = await this.rewardService.claimReward(user.id, rewardId)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async levelProgress({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.achievementService.getLevelProgress(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async streak({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const result = await this.achievementService.getUserStreak(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async leaderboard({ request, response }: HttpContext) {
    try {
      const limit = Number(request.qs().limit) || 50
      const result = await this.achievementService.getGlobalLeaderboard(limit)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
