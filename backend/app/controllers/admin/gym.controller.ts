import type { HttpContext } from '@adonisjs/core/http'
import Gym from '#models/gym'

export default class AdminGymController {
  async index({ request, response }: HttpContext) {
    const status = request.input('status')
    let query = Gym.query().preload('owner')

    if (status) {
      query = query.where('status', status)
    }

    const gyms = await query
    return response.ok(gyms)
  }

  async pending({ response }: HttpContext) {
    const gyms = await Gym.query().where('status', 'pending').preload('owner')
    return response.ok(gyms)
  }

  async show({ params, response }: HttpContext) {
    try {
      const gym = await Gym.query().where('id', params.id).preload('owner').firstOrFail()
      return response.ok(gym)
    } catch (error) {
      return response.notFound({ message: 'Gym not found' })
    }
  }

  async approve({ params, response }: HttpContext) {
    try {
      const gym = await Gym.findOrFail(params.id)

      if (gym.status === 'approved') {
        return response.conflict({ message: 'Gym is already approved' })
      }

      gym.status = 'approved'
      await gym.save()

      return response.ok({
        message: 'Gym approved successfully',
        gym: gym,
      })
    } catch (error) {
      return response.notFound({ message: 'Gym not found' })
    }
  }

  async reject({ params, response }: HttpContext) {
    try {
      const gym = await Gym.findOrFail(params.id)

      if (gym.status === 'rejected') {
        return response.conflict({ message: 'Gym is already rejected' })
      }

      gym.status = 'rejected'
      await gym.save()

      return response.ok({
        message: 'Gym rejected successfully',
        gym: gym,
      })
    } catch (error) {
      return response.notFound({ message: 'Gym not found' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const gym = await Gym.findOrFail(params.id)
      await gym.delete()
      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'Gym not found' })
    }
  }
}
