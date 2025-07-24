import type { HttpContext } from '@adonisjs/core/http'
import { createGroupChallengeValidator } from '#validators/group_challenge'
import { GroupChallengeService } from '../services/group_challenge.service.js'
import { BaseController } from './base_controller.js'

export default class GroupChallengeController extends BaseController {
  private groupChallengeService: GroupChallengeService

  constructor() {
    super()
    this.groupChallengeService = new GroupChallengeService()
  }
  async store({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(createGroupChallengeValidator)
      const user = this.getUserFromAuth(auth)

      const groupData = {
        ...payload,
        createdBy: user.id,
      }

      const result = await this.groupChallengeService.createGroup(groupData)
      return response.created(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async join({ params, response, auth }: HttpContext) {
    try {
      const groupId = this.getValidId(params.id)
      const user = this.getUserFromAuth(auth)

      const result = await this.groupChallengeService.joinGroup(groupId, user.id)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async index({ request, response, auth }: HttpContext) {
    try {
      const userId = request.input('userId') || auth.user?.id
      if (!userId) {
        return response.badRequest({ message: 'userId is required or user must be authenticated' })
      }

      const result = await this.groupChallengeService.getUserGroups(userId)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
