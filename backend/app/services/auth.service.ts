import User from '#models/user'
import { LoginCredentials, RegisterData, UserData } from '../types/auth.types.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class AuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<ServiceResponse<{ user: User; token: string }>> {
    try {
      const user = await User.verifyCredentials(credentials.email, credentials.password)

      return {
        success: true,
        data: {
          user: user,
          token: '',
        },
      }
    } catch (error) {
      throw new ServiceException('Invalid credentials', 'INVALID_CREDENTIALS', 401)
    }
  }

  async register(data: RegisterData): Promise<ServiceResponse<UserData>> {
    try {
      const userData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role || 'user',
      }

      const user = await User.create(userData)

      return {
        success: true,
        data: this.formatUserData(user),
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage?.includes('users_email_unique')) {
        throw new ServiceException('Email already exists', 'EMAIL_EXISTS', 409)
      }
      throw new ServiceException('Failed to create user', 'REGISTRATION_ERROR', 500)
    }
  }

  private formatUserData(user: any): UserData {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISO(),
      updatedAt: user.updatedAt.toISO(),
    }
  }
}
