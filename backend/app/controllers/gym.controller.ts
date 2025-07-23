import Gym from '#models/gym'
import type { HttpContext } from '@adonisjs/core/http'

export default class GymController {
  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const gyms = await Gym.findBy('owner_id', userId)

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

  async update({ params, request, response, auth }: HttpContext) {
    const userId = auth.user!.id

    try {
      const gym = await Gym.findOrFail(params.id)

      if (gym.ownerId !== userId) {
        return response.forbidden({ message: 'You are not authorized to update this gym' })
      }

      gym.merge(request.only(['name', 'contact', 'description']))

      await gym.save()

      return response.ok(gym)
    } catch (error) {
      return response.notFound({ message: 'Gym not found' })
    }
  }
}
