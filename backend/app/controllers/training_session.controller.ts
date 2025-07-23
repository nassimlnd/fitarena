import type { HttpContext } from '@adonisjs/core/http'
import { createTrainingSessionValidator } from '#validators/training_session'
import { TrainingService } from '../services/training_service.js'
import { BaseController } from './base_controller.js'

export default class TrainingSessionController extends BaseController {
  private trainingService = new TrainingService()

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const payload = await request.validateUsing(createTrainingSessionValidator)

      const result = await this.trainingService.createTrainingSession(payload, user.id)

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
      const sessionId = this.getValidId(params.id, 'training session ID')

      const result = await this.trainingService.getTrainingSession(sessionId, user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async index({ request, response, auth }: HttpContext) {
    try {
      const user = this.getUserFromAuth(auth)
      const filters = request.qs()

      const result = await this.trainingService.getUserTrainingSessions(user.id, filters)

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
      const sessionId = this.getValidId(params.id, 'training session ID')
      const payload = await request.validateUsing(createTrainingSessionValidator) // Reuse validator for now

      const result = await this.trainingService.updateTrainingSession(sessionId, payload, user.id)

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
      const sessionId = this.getValidId(params.id, 'training session ID')

      const result = await this.trainingService.deleteTrainingSession(sessionId, user.id)

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

      const result = await this.trainingService.getUserTrainingStats(user.id)

      if (result.success) {
        return response.ok(result.data)
      }

      return response.badRequest({ message: result.error })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
