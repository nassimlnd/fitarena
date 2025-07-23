import Challenge from '#models/challenge'
import Gym from '#models/gym'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChallengeController {
  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const gym = await Gym.findBy('owner_id', userId)

    if (!gym) {
      return response.notFound({ message: 'Gym not found for the authenticated user.' })
    }

    const challenge = await Challenge.create({
      ...request.only(['name', 'score']),
      gymId: gym.id,
    })

    return response.created(challenge)
  }

  async getByGymId({ params, response }: HttpContext) {
    const { id } = params

    const challenges = await Challenge.findManyBy('gym_id', id)

    return response.ok(challenges)
  }

  async claim({ params, response, auth }: HttpContext) {
    const { id } = params
    const userId = auth.user

    const challenge = await Challenge.findOrFail(id)

    // @todo add user score
    // user.score += challenge.score;

    return response.ok({ message: 'Challenge claimed successfully', challenge })
  }
}
