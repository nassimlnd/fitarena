import type { HttpContext } from '@adonisjs/core/http'
import { ExerciseService } from '../services/exercise.service.js'
import { BaseController } from './base_controller.js'

export default class ExerciseController extends BaseController {
  private exerciseService: ExerciseService

  constructor() {
    super()
    this.exerciseService = new ExerciseService()
  }

  /**
   * Get all exercises for public consumption
   */
  async index({ request, response }: HttpContext) {
    try {
      const { search, page = 1, limit = 20, muscle } = request.qs()

      const result = await this.exerciseService.getAllExercises()
      let exercises = result.data || []

      // Apply search filter
      if (search) {
        exercises = exercises.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(search.toLowerCase()) ||
            exercise.description.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Apply muscle filter
      if (muscle) {
        exercises = exercises.filter((exercise) =>
          exercise.muscles.some((m) => m.toLowerCase().includes(muscle.toLowerCase()))
        )
      }

      // Basic pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit)
      const endIndex = startIndex + parseInt(limit)
      const paginatedExercises = exercises.slice(startIndex, endIndex)

      return response.ok({
        data: paginatedExercises,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: exercises.length,
          totalPages: Math.ceil(exercises.length / parseInt(limit)),
        },
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Get single exercise details
   */
  async show({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.exerciseService.getExerciseById(id)

      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Get exercises by muscle group
   */
  async byMuscle({ params, request, response }: HttpContext) {
    try {
      const { muscle } = params
      const { page = 1, limit = 20 } = request.qs()

      const result = await this.exerciseService.getAllExercises()
      let exercises = result.data || []

      // Filter by muscle group
      exercises = exercises.filter((exercise) =>
        exercise.muscles.some((m) => m.toLowerCase().includes(muscle.toLowerCase()))
      )

      // Basic pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit)
      const endIndex = startIndex + parseInt(limit)
      const paginatedExercises = exercises.slice(startIndex, endIndex)

      return response.ok({
        data: paginatedExercises,
        muscle: muscle,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: exercises.length,
          totalPages: Math.ceil(exercises.length / parseInt(limit)),
        },
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Get all unique muscle groups from exercises
   */
  async muscles({ response }: HttpContext) {
    try {
      const result = await this.exerciseService.getAllExercises()
      const exercises = result.data || []

      // Extract unique muscles
      const allMuscles = exercises.flatMap((exercise) => exercise.muscles)
      const uniqueMuscles = [...new Set(allMuscles)].sort()

      return response.ok({
        muscles: uniqueMuscles,
        count: uniqueMuscles.length,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  /**
   * Search exercises with advanced filters
   */
  async search({ request, response }: HttpContext) {
    try {
      const { query, muscles, page = 1, limit = 20 } = request.qs()

      if (!query || query.trim().length < 2) {
        return response.badRequest({
          message: 'Search query must be at least 2 characters long',
        })
      }

      const result = await this.exerciseService.getAllExercises()
      let exercises = result.data || []

      // Apply text search
      exercises = exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.description.toLowerCase().includes(query.toLowerCase()) ||
          exercise.muscles.some((muscle) => muscle.toLowerCase().includes(query.toLowerCase()))
      )

      // Apply muscle filters if provided
      if (muscles) {
        const muscleFilters = Array.isArray(muscles) ? muscles : [muscles]
        exercises = exercises.filter((exercise) =>
          muscleFilters.some((filter) =>
            exercise.muscles.some((muscle) => muscle.toLowerCase().includes(filter.toLowerCase()))
          )
        )
      }

      // Sort by relevance (name match first, then description)
      exercises.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0
        const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0
        const aDescMatch = a.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
        const bDescMatch = b.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0

        return bNameMatch + bDescMatch - (aNameMatch + aDescMatch)
      })

      // Pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit)
      const endIndex = startIndex + parseInt(limit)
      const paginatedExercises = exercises.slice(startIndex, endIndex)

      return response.ok({
        data: paginatedExercises,
        query,
        filters: { muscles },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: exercises.length,
          totalPages: Math.ceil(exercises.length / parseInt(limit)),
        },
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
