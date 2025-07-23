import type { HttpContext } from '@adonisjs/core/http'
import { ChallengeService } from '../services/challenge_service.js'
import { BaseController } from './base_controller.js'

export default class ChallengeController extends BaseController {
  private challengeService = new ChallengeService()

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const payload = request.only(['name', 'score', 'description', 'objectives', 'type'])

      const result = await this.challengeService.createGymChallenge(payload, user.id)

      if (result.success) {
        return response.created(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async getByGymId({ params, response }: HttpContext) {
    try {
      const gymId = this.getValidId(params.id, 'gym ID')

      const result = await this.challengeService.getGymChallenges(gymId)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async claim({ params, response }: HttpContext) {
    try {
      const challengeId = this.getValidId(params.id, 'challenge ID')

      const result = await this.challengeService.getChallengeById(challengeId)

      if (result.success) {
        // @todo: Implement user score logic in a dedicated service
        return response.ok({ message: 'Challenge claimed successfully', challenge: result.data })
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
