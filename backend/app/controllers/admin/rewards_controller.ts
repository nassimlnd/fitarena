import type { HttpContext } from '@adonisjs/core/http'
import { RewardService } from '../../services/reward_service.js'
import { BaseController } from '../base_controller.js'

export default class AdminRewardsController extends BaseController {
  private rewardService = new RewardService()

  async index({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const filters = request.qs()
      const result = await this.rewardService.getAllRewards(filters)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const payload = request.body()

      // Basic validation
      if (!payload.name || !payload.type || !payload.conditions) {
        return response.badRequest({
          message: 'Missing required fields: name, type, conditions',
        })
      }

      const result = await this.rewardService.createReward(payload as any)

      if (result.success) {
        return response.created(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const rewardId = this.getValidId(params.id, 'reward ID')
      const result = await this.rewardService.getReward(rewardId)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const rewardId = this.getValidId(params.id, 'reward ID')
      const payload = request.body()
      const result = await this.rewardService.updateReward(rewardId, payload)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const rewardId = this.getValidId(params.id, 'reward ID')
      const result = await this.rewardService.deleteReward(rewardId)

      if (result.success) {
        return response.noContent()
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async getUserRewards({ params, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const userId = this.getValidId(params.userId, 'user ID')
      const result = await this.rewardService.getUserRewards(userId)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async deactivateUserReward({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const { userId, rewardId } = request.body()

      if (!userId || !rewardId) {
        return response.badRequest({ message: 'User ID and Reward ID are required' })
      }

      const result = await this.rewardService.deactivateUserReward(userId, rewardId)

      if (result.success) {
        return response.ok({ message: 'Reward deactivated successfully' })
      }

      return response.badRequest({ message: 'Failed to deactivate reward' })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
