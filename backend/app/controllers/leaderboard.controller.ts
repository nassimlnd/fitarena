import type { HttpContext } from '@adonisjs/core/http'
import TrainingSession from '#models/training_session'

export default class LeaderboardController {
  async index({ request, response }: HttpContext) {
    const challengeId = request.input('challengeId')

    if (!challengeId) {
      return response.badRequest({ message: 'challengeId is required' })
    }

    const sessions = await TrainingSession.query().where('challengeId', challengeId)
    const leaderboard: Record<
      number,
      { userId: number; total_duration: number; total_calories: number }
    > = {}
    sessions.forEach((s) => {
      if (!leaderboard[s.userId]) {
        leaderboard[s.userId] = { userId: s.userId, total_duration: 0, total_calories: 0 }
      }
      leaderboard[s.userId].total_duration += s.duration || 0
      leaderboard[s.userId].total_calories += s.caloriesBurned || 0
    })
    const sorted = Object.values(leaderboard).sort((a, b) => b.total_duration - a.total_duration)

    return response.ok(sorted)
  }
}
