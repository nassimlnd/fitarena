import type { HttpContext } from '@adonisjs/core/http'
import {
  createChallengeClientValidator,
  updateChallengeClientValidator,
} from '#validators/challenge'
import { ChallengeService } from '../services/challenge_service.js'
import { BaseController } from './base_controller.js'

export default class ChallengeClientController extends BaseController {
  private challengeService = new ChallengeService()

  async index({ request, response }: HttpContext) {
    try {
      const filters = request.qs()

      const result = await this.challengeService.getUserChallenges(filters)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const challengeId = this.getValidId(params.id, 'challenge ID')

      const result = await this.challengeService.getChallengeById(challengeId)

      if (result.success && result.data?.creatorType === 'user') {
        return response.ok(result.data)
      }

      return response.notFound({ message: 'User challenge not found' })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const payload = await request.validateUsing(createChallengeClientValidator)

      const result = await this.challengeService.createUserChallenge(payload, user.id)

      if (result.success) {
        return response.created(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const challengeId = this.getValidId(params.id, 'challenge ID')
      const payload = await request.validateUsing(updateChallengeClientValidator)

      const result = await this.challengeService.updateChallenge(
        challengeId,
        payload,
        user.id,
        user.role
      )

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
      const challengeId = this.getValidId(params.id, 'challenge ID')

      const result = await this.challengeService.deleteChallenge(challengeId, user.id, user.role)

      if (result.success) {
        return response.noContent()
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
