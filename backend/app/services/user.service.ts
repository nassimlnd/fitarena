import { UserRepository } from '../repositories/user_repository.js'
import { UserData } from '../types/user.dto.js'
import { UserFilterOptions } from '../types/repositories/user.types.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async getAllUsers(filters?: UserFilterOptions): Promise<ServiceResponse<UserData[]>> {
    try {
      const users = await this.userRepository.findMany(filters)
      return {
        success: true,
        data: users.map((user) => this.formatUserData(user)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch users', 'FETCH_ERROR', 500)
    }
  }

  async getUserById(id: number): Promise<ServiceResponse<UserData>> {
    try {
      const user = await this.userRepository.findById(id)
      if (!user) {
        throw new ServiceException('User not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatUserData(user),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch user', 'FETCH_ERROR', 500)
    }
  }

  async updateUserRole(id: number, role: string): Promise<ServiceResponse<UserData>> {
    try {
      const validRoles = ['admin', 'gymOwner', 'user']
      if (!validRoles.includes(role)) {
        throw new ServiceException('Invalid role', 'INVALID_ROLE', 400)
      }

      const user = await this.userRepository.update(id, { role: role as any })
      if (!user) {
        throw new ServiceException('User not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatUserData(user),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to update user role', 'UPDATE_ERROR', 500)
    }
  }

  async deactivateUser(id: number, currentUserId: number): Promise<ServiceResponse<UserData>> {
    try {
      if (id === currentUserId) {
        throw new ServiceException('Cannot deactivate your own account', 'FORBIDDEN', 403)
      }

      const user = await this.userRepository.update(id, { isActive: false })
      if (!user) {
        throw new ServiceException('User not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatUserData(user),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to deactivate user', 'UPDATE_ERROR', 500)
    }
  }

  async activateUser(id: number): Promise<ServiceResponse<UserData>> {
    try {
      const user = await this.userRepository.update(id, { isActive: true })
      if (!user) {
        throw new ServiceException('User not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatUserData(user),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to activate user', 'UPDATE_ERROR', 500)
    }
  }

  async deleteUser(id: number, currentUserId: number): Promise<ServiceResponse<void>> {
    try {
      if (id === currentUserId) {
        throw new ServiceException('Cannot delete your own account', 'FORBIDDEN', 403)
      }

      const deleted = await this.userRepository.delete(id)
      if (!deleted) {
        throw new ServiceException('User not found', 'NOT_FOUND', 404)
      }

      return {
        success: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to delete user', 'DELETE_ERROR', 500)
    }
  }

  private formatUserData(user: any): UserData {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt.toISO(),
      updatedAt: user.updatedAt.toISO(),
      totalPoints: user.totalPoints ?? 0,
      availablePoints: user.availablePoints ?? 0,
      level: user.level ?? 1,
      experiencePoints: user.experiencePoints ?? 0,
      achievementsProgress: user.achievementsProgress ?? [],
    }
  }
}
