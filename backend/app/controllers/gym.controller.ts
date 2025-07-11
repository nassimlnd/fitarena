import Gym from '#models/gym'
import type { HttpContext } from '@adonisjs/core/http'

export default class GymController {
  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user!.id;
    const gyms = await Gym.findBy('owner_id', userId);

    if (gyms) {
      return response.conflict({ message: 'You already own a gym' })
    }

    const gymData = {
      ...request.only(['name', 'contact', 'description']),
      ownerId: userId,
    }

    const gym = await Gym.create(gymData)

    return response.created(gym)
  }

  async list({ response }: HttpContext) {
    const gyms = await Gym.all()

    return response.ok(gyms)
  }
}
