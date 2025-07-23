import type { HttpContext } from '@adonisjs/core/http'
import TrainingSession from '#models/training_session'

export default class LeaderboardController {
  async index({ request, response }: HttpContext) {
    const challengeId = request.input('challenge_id')

    if (!challengeId) {
      return response.badRequest({ message: 'challenge_id is required' })
    }

    const sessions = await TrainingSession.query().where('challenge_id', challengeId)
    const leaderboard: Record<
      number,
      { user_id: number; total_duration: number; total_calories: number }
    > = {}
    sessions.forEach((s) => {
      if (!leaderboard[s.user_id]) {
        leaderboard[s.user_id] = { user_id: s.user_id, total_duration: 0, total_calories: 0 }
      }
      leaderboard[s.user_id].total_duration += s.duration || 0
      leaderboard[s.user_id].total_calories += s.calories_burned || 0
    })
    const sorted = Object.values(leaderboard).sort((a, b) => b.total_duration - a.total_duration)

    return response.ok(sorted)
  }
}
