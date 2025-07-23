import type { HttpContext } from '@adonisjs/core/http'
import { ServiceException } from '../types/common_types.js'
import User from '#models/user'

export abstract class BaseController {
  protected getUserFromAuth(auth: HttpContext['auth']): User {
    const user = auth.user
    if (!user) {
      throw new ServiceException('User not authenticated', 'UNAUTHORIZED', 401)
    }
    return user
  }

  protected getValidId(paramValue: string, paramName: string = 'ID'): number {
    const id = Number(paramValue)
    if (Number.isNaN(id)) {
      throw new ServiceException(`Invalid ${paramName}`, 'INVALID_PARAM', 400)
    }
    return id
  }

  protected handleServiceError(error: unknown, response: HttpContext['response']) {
    if (error instanceof ServiceException) {
      return response.status(error.statusCode || 500).json({ message: error.message })
    }
    throw error
  }
}
