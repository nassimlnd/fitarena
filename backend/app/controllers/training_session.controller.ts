import type { HttpContext } from '@adonisjs/core/http'
import TrainingSession from '#models/training_session'
import { createTrainingSessionValidator } from '#validators/training_session'

export default class TrainingSessionController {
  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createTrainingSessionValidator)
    const session = await TrainingSession.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.created(session)
  }

  async index({ request, response, auth }: HttpContext) {
    const userId = request.input('userId') || auth.user?.id

    if (!userId) {
      return response.badRequest({ message: 'userId is required or user must be authenticated' })
    }

    const sessions = await TrainingSession.query().where('userId', userId)
    return response.ok(sessions)
  }

  async stats({ request, response, auth }: HttpContext) {
    const userId = request.input('userId') || auth.user?.id

    if (!userId) {
      return response.badRequest({ message: 'userId is required or user must be authenticated' })
    }

    const sessions = await TrainingSession.query().where('userId', userId)
    const totalCalories = sessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0)
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const challengeProgress: Record<number, number> = {}
    sessions.forEach((s) => {
      if (s.challengeId) {
        challengeProgress[s.challengeId] = (challengeProgress[s.challengeId] || 0) + 1
      }
    })

    return response.ok({
      total_sessions: sessions.length,
      total_calories: totalCalories,
      total_duration: totalDuration,
      challenge_progress: challengeProgress,
    })
  }
}
