import type { HttpContext } from '@adonisjs/core/http'
import {
  createChallengeInvitationValidator,
  respondChallengeInvitationValidator,
} from '#validators/challenge_invitation'
import { InvitationService } from '../services/invitation_service.js'
import { BaseController } from './base_controller.js'

export default class ChallengeInvitationController extends BaseController {
  private invitationService = new InvitationService()

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const payload = await request.validateUsing(createChallengeInvitationValidator)

      const result = await this.invitationService.createInvitation(payload, user.id)

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
      const invitationId = this.getValidId(params.id, 'invitation ID')

      const result = await this.invitationService.getInvitation(invitationId, user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async sent({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)

      const result = await this.invitationService.getSentInvitations(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async received({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)

      const result = await this.invitationService.getReceivedInvitations(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async respond({ params, request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const invitationId = this.getValidId(params.id, 'invitation ID')
      const { status } = await request.validateUsing(respondChallengeInvitationValidator)

      const result = await this.invitationService.respondToInvitation(invitationId, status, user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async cancel({ params, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const invitationId = this.getValidId(params.id, 'invitation ID')

      const result = await this.invitationService.cancelInvitation(invitationId, user.id)

      if (result.success) {
        return response.noContent()
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async stats({ response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)

      const result = await this.invitationService.getUserInvitationStats(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
