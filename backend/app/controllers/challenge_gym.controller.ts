import type { HttpContext } from '@adonisjs/core/http'
import { createChallengeGymValidator, updateChallengeGymValidator } from '#validators/challenge'
import { ChallengeService } from '../services/challenge_service.js'
import { BaseController } from './base_controller.js'

export default class ChallengeGymController extends BaseController {
  private challengeService = new ChallengeService()

  async index({ response }: HttpContext) {
    try {
      const result = await this.challengeService.getGymChallenges()

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

      if (result.success && result.data?.creatorType === 'gym') {
        return response.ok(result.data)
      }

      return response.notFound({ message: 'Gym challenge not found' })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const payload = await request.validateUsing(createChallengeGymValidator)

      const result = await this.challengeService.createGymChallenge(payload, user.id)

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
      const payload = await request.validateUsing(updateChallengeGymValidator)

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
