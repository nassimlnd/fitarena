import type { HttpContext } from '@adonisjs/core/http'
import { ChallengeService } from '../services/challenge_service.js'
import { ChallengeParticipationService } from '../services/challenge_participation.service.js'
import { BaseController } from './base_controller.js'
import { claimChallengeValidator } from '../validators/challenge_participation.js'

export default class ChallengeController extends BaseController {
  private challengeService = new ChallengeService()
  private participationService = new ChallengeParticipationService()

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

  async claim({ params, request, response, auth }: HttpContext) {
    try {
      const challengeId = this.getValidId(params.id, 'challenge ID')
      const user = this.getUserFromAuth(auth)
      const { notes, completedAt } = await request.validateUsing(claimChallengeValidator)

      const result = await this.participationService.claimChallenge(user.id, challengeId, {
        notes,
        completedAt: completedAt?.toISOString(),
      })

      return response.ok({
        message: 'Challenge claimed successfully',
        participation: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async start({ params, response, auth }: HttpContext) {
    try {
      const challengeId = this.getValidId(params.id, 'challenge ID')
      const user = this.getUserFromAuth(auth)

      const result = await this.participationService.startChallenge(user.id, challengeId)

      return response.created({
        message: 'Challenge started successfully',
        participation: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async myParticipations({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const { status } = request.qs()

      const result = await this.participationService.getUserParticipations(user.id, status)

      return response.ok({
        data: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async myStats({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)

      const result = await this.participationService.getUserChallengeStats(user.id)

      return response.ok({
        stats: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
