import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    const accessToken = await auth.use('api').createToken(user, ['*'], {
      expiresIn: '1 hour',
    })

    return {
      accessToken: accessToken.value?.release(),
    }
  }

  // @todo register as GymOwner
  async register({ request, response }: HttpContext) {
    const {
      fullName,
      email,
      password,
      isGymOwner = false,
    } = request.only(['fullName', 'email', 'password', 'isGymOwner'])

    const user = await User.create({
      fullName,
      email,
      password,
      role: isGymOwner ? 'gymOwner' : 'user',
    })

    return response.created(user)
  }
}
