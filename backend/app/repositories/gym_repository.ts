import Gym from '#models/gym'
import { BaseRepositoryInterface } from './base_repository.js'
import { CreateGymDTO, UpdateGymDTO, GymFilterOptions } from '../types/gym.dto.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'

type CreateGymData = CreateGymDTO & {
  ownerId: number
  status: 'pending' | 'approved' | 'rejected'
}

export class GymRepository implements BaseRepositoryInterface<Gym, CreateGymData, UpdateGymDTO> {
  async create(data: CreateGymData): Promise<Gym> {
    return await Gym.create(data)
  }

  async findById(id: number): Promise<Gym | null> {
    return await Gym.find(id)
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<Gym[]> {
    let query = Gym.query()

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

  async update(id: number, data: UpdateGymDTO): Promise<Gym | null> {
    const gym = await this.findById(id)
    if (!gym) return null

    gym.merge(data)
    await gym.save()
    return gym
  }

  async delete(id: number): Promise<boolean> {
    const gym = await this.findById(id)
    if (!gym) return false

    await gym.delete()
    return true
  }

  async findByOwner(ownerId: number): Promise<Gym | null> {
    return await Gym.findBy('ownerId', ownerId)
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Gym[]> {
    return await Gym.query().where('status', status)
  }

  async findApprovedGyms(): Promise<Gym[]> {
    return await Gym.query().where('status', 'approved')
  }

  async findPendingGyms(): Promise<Gym[]> {
    return await Gym.query().where('status', 'pending').preload('owner')
  }

  async findWithFilters(filters: GymFilterOptions): Promise<Gym[]> {
    let query = Gym.query().preload('owner')

    if (filters.status) {
      query = query.where('status', filters.status)
    }

    if (filters.ownerId) {
      query = query.where('ownerId', filters.ownerId)
    }

    return await query
  }

  async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Gym | null> {
    const gym = await this.findById(id)
    if (!gym) return null

    gym.status = status
    await gym.save()
    return gym
  }
}
