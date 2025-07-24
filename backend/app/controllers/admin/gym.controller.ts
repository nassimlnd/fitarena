import type { HttpContext } from '@adonisjs/core/http'
import { GymService } from '../../services/gym_service.js'
import { BaseController } from '../base_controller.js'

export default class AdminGymController extends BaseController {
  private gymService: GymService

  constructor() {
    super()
    this.gymService = new GymService()
  }
  async index({ request, response }: HttpContext) {
    try {
      const status = request.input('status')
      let result

      if (status === 'pending') {
        result = await this.gymService.getPendingGyms()
      } else if (status === 'approved') {
        result = await this.gymService.getApprovedGyms()
      } else {
        // Si pas de status ou autre status, on retourne les gyms approuvées par défaut
        result = await this.gymService.getApprovedGyms()
      }

      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async pending({ response }: HttpContext) {
    try {
      const result = await this.gymService.getPendingGyms()
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.gymService.getGymById(id)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async approve({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.gymService.approveGym(id)
      return response.ok({
        message: 'Gym approved successfully',
        gym: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async reject({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.gymService.rejectGym(id)
      return response.ok({
        message: 'Gym rejected successfully',
        gym: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      await this.gymService.deleteGym(id)
      return response.noContent()
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
