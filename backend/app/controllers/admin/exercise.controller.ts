import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import { createExerciseValidator, updateExerciseValidator } from '#validators/admin/exercise'

export default class AdminExerciseController {
  async index({ response }: HttpContext) {
    const exercises = await Exercise.all()
    return response.ok(exercises)
  }

  async store({ request, response }: HttpContext) {
    const { name, description, muscles } = await request.validateUsing(createExerciseValidator)

    const exercise = await Exercise.create({
      name,
      description,
      muscles: Array.isArray(muscles) ? muscles : [muscles],
    })

    return response.created(exercise)
  }

  async show({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.findOrFail(params.id)
      return response.ok(exercise)
    } catch (error) {
      return response.notFound({ message: 'Exercise not found' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const exercise = await Exercise.findOrFail(params.id)
      const payload = await request.validateUsing(updateExerciseValidator)
      const { name, description, muscles } = payload

      exercise.merge({
        name,
        description,
        muscles: muscles ? (Array.isArray(muscles) ? muscles : [muscles]) : undefined,
      })

      await exercise.save()
      return response.ok(exercise)
    } catch (error) {
      return response.notFound({ message: 'Exercise not found' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const exercise = await Exercise.findOrFail(params.id)
      await exercise.delete()
      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'Exercise not found' })
    }
  }
}
