import Gym from '#models/gym'
import type { HttpContext } from '@adonisjs/core/http'

export default class GymController {
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const gymData = {
      ...request.only([
        'name',
        'contact',
        'description',
      ]),
    }

    const gym = await Gym.create(gymData)

    return response.created(gym)
  }

  async list({ response }: HttpContext) {
    const gyms = await Gym.all()

    return response.ok(gyms)
  }
}
