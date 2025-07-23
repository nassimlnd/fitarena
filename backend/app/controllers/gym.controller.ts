import type { HttpContext } from '@adonisjs/core/http'
import { createGymValidator, updateGymValidator } from '#validators/gym'
import { GymService } from '../services/gym_service.js'
import { BaseController } from './base_controller.js'

export default class GymController extends BaseController {
  private gymService = new GymService()

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const payload = await request.validateUsing(createGymValidator)

      const result = await this.gymService.createGym(payload, user.id)

      if (result.success) {
        return response.created(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async list({ response }: HttpContext) {
    try {
      const result = await this.gymService.getApprovedGyms()

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
      const gymId = this.getValidId(params.id, 'gym ID')
      const payload = await request.validateUsing(updateGymValidator)

      const result = await this.gymService.updateGym(gymId, payload, user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
