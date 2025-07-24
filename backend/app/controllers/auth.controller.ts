import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import { AuthService } from '../services/auth.service.js'
import { BaseController } from './base_controller.js'

export default class AuthController extends BaseController {
  private authService: AuthService

  constructor() {
    super()
    this.authService = new AuthService()
  }
  async login({ request, auth, response }: HttpContext) {
    try {
      const credentials = await request.validateUsing(loginValidator)
      const result = await this.authService.login(credentials)

      if (!result.data?.user) {
        throw new Error('User data not found')
      }

      const accessToken = await auth.use('api').createToken(result.data.user, ['*'], {
        expiresIn: '1 hour',
      })

      return response.ok({
        accessToken: accessToken.value?.release(),
        user: result.data.user,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const result = await this.authService.register(payload)

      return response.created(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
