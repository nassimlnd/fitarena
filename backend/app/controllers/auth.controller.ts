import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const accessToken = await auth.use('api').createToken(user, ['*'], {
      expiresIn: '1 hour',
    })

    return {
      accessToken: accessToken.value?.release(),
    }
  }

  async register({ request, response }: HttpContext) {
    const {
      fullName,
      email,
      password,
      role = 'user',
    } = await request.validateUsing(registerValidator)

    try {
      const user = await User.create({
        fullName,
        email,
        password,
        role,
      })

      return response.created(user)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage?.includes('users_email_unique')) {
        return response.conflict({ message: 'Email already exists' })
      }
      throw error
    }
  }
}
