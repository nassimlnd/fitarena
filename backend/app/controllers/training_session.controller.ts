import type { HttpContext } from '@adonisjs/core/http'
import TrainingSession from '#models/training_session'

export default class TrainingSessionController {
  async store({ request, response, auth }: HttpContext) {
    const { challenge_id, date, duration, calories_burned, metrics } = request.only([
      'challenge_id',
      'date',
      'duration',
      'calories_burned',
      'metrics',
    ])
    const session = await TrainingSession.create({
      challenge_id,
      date,
      duration,
      calories_burned,
      metrics,
      user_id: auth.user!.id,
    })

    return response.created(session)
  }

  async index({ request, response, auth }: HttpContext) {
    const userId = request.input('user_id') || auth.user?.id

    if (!userId) {
      return response.badRequest({ message: 'user_id is required or user must be authenticated' })
    }

    const sessions = await TrainingSession.query().where('user_id', userId)
    return response.ok(sessions)
  }

  async stats({ request, response, auth }: HttpContext) {
    const userId = request.input('user_id') || auth.user?.id

    if (!userId) {
      return response.badRequest({ message: 'user_id is required or user must be authenticated' })
    }

    const sessions = await TrainingSession.query().where('user_id', userId)
    const totalCalories = sessions.reduce((sum, s) => sum + (s.calories_burned || 0), 0)
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const challengeProgress: Record<number, number> = {}
    sessions.forEach((s) => {
      if (s.challenge_id) {
        challengeProgress[s.challenge_id] = (challengeProgress[s.challenge_id] || 0) + 1
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
