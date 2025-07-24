import type { HttpContext } from '@adonisjs/core/http'
import { createExerciseValidator, updateExerciseValidator } from '#validators/admin/exercise'
import { ExerciseService } from '../../services/exercise.service.js'
import { BaseController } from '../base_controller.js'

export default class AdminExerciseController extends BaseController {
  private exerciseService: ExerciseService

  constructor() {
    super()
    this.exerciseService = new ExerciseService()
  }
  async index({ response }: HttpContext) {
    try {
      const result = await this.exerciseService.getAllExercises()
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createExerciseValidator)
      const result = await this.exerciseService.createExercise(payload)
      return response.created(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.exerciseService.getExerciseById(id)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const payload = await request.validateUsing(updateExerciseValidator)
      const result = await this.exerciseService.updateExercise(id, payload)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      await this.exerciseService.deleteExercise(id)
      return response.noContent()
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
