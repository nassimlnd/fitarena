import type { HttpContext } from '@adonisjs/core/http'
import { BadgeService } from '../../services/badge_service.js'
import { BadgeRepository } from '../../repositories/badge_repository.js'
import { BaseController } from '../base_controller.js'
import { createBadgeValidator, awardBadgeValidator } from '../../validators/admin/badge.js'

export default class AdminBadgesController extends BaseController {
  private badgeService = new BadgeService()
  private badgeRepository = new BadgeRepository()

  async index({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const filters = request.qs()
      const result = await this.badgeService.getAllBadges(filters)

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

      const payload = await request.validateUsing(createBadgeValidator)

      const result = await this.badgeService.createBadge(payload as any)

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

      const badgeId = this.getValidId(params.id, 'badge ID')
      const result = await this.badgeService.getBadge(badgeId)

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

      const badgeId = this.getValidId(params.id, 'badge ID')
      const payload = request.body()
      const result = await this.badgeService.updateBadge(badgeId, payload)

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

      const badgeId = this.getValidId(params.id, 'badge ID')
      const result = await this.badgeService.deleteBadge(badgeId)

      if (result.success) {
        return response.noContent()
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async awardToUser({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const { userId, badgeId, reason } = await request.validateUsing(awardBadgeValidator)
      const context = reason // Map reason to context for backward compatibility

      const success = await this.badgeRepository.awardBadgeToUser(userId, badgeId, {
        reason: context,
      })

      if (success) {
        return response.ok({ message: 'Badge awarded successfully' })
      }

      return response.badRequest({ message: 'Failed to award badge' })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async getUserBadges({ params, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Admin access required' })
      }

      const userId = this.getValidId(params.userId, 'user ID')
      const result = await this.badgeService.getUserBadges(userId)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
