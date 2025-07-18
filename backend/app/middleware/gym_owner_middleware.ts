import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GymOwnerMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    await auth.use('api').authenticate()

    const user = auth.user

    if (!user || user.role !== 'gymOwner') {
      return response.unauthorized({ message: 'Access restricted to gymOwner' })
    }

    await next()
  }
}
