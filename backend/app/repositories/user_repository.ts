import User from '#models/user'
import { BaseRepositoryInterface } from './base_repository.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'

type CreateUserData = {
  fullName?: string
  email: string
  password: string
  role: 'admin' | 'gymOwner' | 'user'
}

type UpdateUserData = {
  fullName?: string
  email?: string
  password?: string
  role?: 'admin' | 'gymOwner' | 'user'
  isActive?: boolean
}

export class UserRepository
  implements BaseRepositoryInterface<User, CreateUserData, UpdateUserData>
{
  async create(data: CreateUserData): Promise<User> {
    return await User.create(data)
  }

  async findById(id: number): Promise<User | null> {
    return await User.find(id)
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<User[]> {
    let query = User.query()

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined) {
          query = query.where(key, filters[key])
        }
      })
    }

    if (pagination?.page && pagination?.limit) {
      query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    }

    return await query
  }

  async update(id: number, data: UpdateUserData): Promise<User | null> {
    const user = await this.findById(id)
    if (!user) return null

    user.merge(data)
    await user.save()
    return user
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) return false

    await user.delete()
    return true
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }

  async findByRole(role: 'user' | 'gymOwner' | 'admin'): Promise<User[]> {
    return await User.query().where('role', role)
  }

  async findGymOwners(): Promise<User[]> {
    return await User.query().where('role', 'gymOwner').preload('gym')
  }

  async hasGym(userId: number): Promise<boolean> {
    const user = await User.query().where('id', userId).preload('gym').first()

    return user?.gym !== null
  }

  async getUserWithGym(userId: number): Promise<User | null> {
    return await User.query().where('id', userId).preload('gym').first()
  }
}
