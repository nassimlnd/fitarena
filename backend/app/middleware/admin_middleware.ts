import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    await auth.use('api').authenticate()

    const user = auth.user

    if (!user || user.role !== 'admin') {
      return response.unauthorized({ message: 'Access restricted to administrators' })
    }

    await next()
  }
}
