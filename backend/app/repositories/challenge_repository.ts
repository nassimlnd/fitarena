import Challenge from '#models/challenge'
import { BaseRepositoryInterface } from './base_repository.js'
import {
  CreateChallengeDTO,
  UpdateChallengeDTO,
  ChallengeFilterOptions,
} from '../types/challenge.dto.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'

type CreateChallengeData = CreateChallengeDTO & {
  creatorId?: number | null
  gymId?: number | null
  creatorType: 'user' | 'gym'
}

export class ChallengeRepository
  implements BaseRepositoryInterface<Challenge, CreateChallengeData, UpdateChallengeDTO>
{
  async create(data: CreateChallengeData): Promise<Challenge> {
    return await Challenge.create(data)
  }

  async findById(id: number): Promise<Challenge | null> {
    return await Challenge.find(id)
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<Challenge[]> {
    let query = Challenge.query()

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

  async update(id: number, data: UpdateChallengeDTO): Promise<Challenge | null> {
    const challenge = await this.findById(id)
    if (!challenge) return null

    challenge.merge(data)
    await challenge.save()
    return challenge
  }

  async delete(id: number): Promise<boolean> {
    const challenge = await this.findById(id)
    if (!challenge) return false

    await challenge.delete()
    return true
  }

  async findByCreatorType(creatorType: 'user' | 'gym'): Promise<Challenge[]> {
    return await Challenge.query().where('creatorType', creatorType)
  }

  async findUserChallenges(isPublic: boolean = true): Promise<Challenge[]> {
    return await Challenge.query().where('creatorType', 'user').where('isPublic', isPublic)
  }

  async findGymChallenges(gymId?: number): Promise<Challenge[]> {
    let query = Challenge.query().where('creatorType', 'gym')

    if (gymId) {
      query = query.where('gymId', gymId)
    }

    return await query
  }

  async findByCreator(creatorId: number, creatorType: 'user' | 'gym'): Promise<Challenge[]> {
    let query = Challenge.query().where('creatorType', creatorType)

    if (creatorType === 'user') {
      query = query.where('creatorId', creatorId)
    } else {
      query = query.where('gymId', creatorId) // creatorId est le gymId pour les gym challenges
    }

    return await query
  }

  async findWithFilters(filters: ChallengeFilterOptions): Promise<Challenge[]> {
    let query = Challenge.query()

    if (filters.difficulty) {
      query = query.where('difficulty', filters.difficulty)
    }

    if (filters.type) {
      query = query.where('type', filters.type)
    }

    if (filters.minDuration) {
      query = query.where('duration', '>=', filters.minDuration)
    }

    if (filters.maxDuration) {
      query = query.where('duration', '<=', filters.maxDuration)
    }

    if (filters.creatorType) {
      query = query.where('creatorType', filters.creatorType)
    }

    if (filters.isPublic !== undefined) {
      query = query.where('isPublic', filters.isPublic)
    }

    return await query
  }

  async validateOwnership(challengeId: number, userId: number, userRole: string): Promise<boolean> {
    const challenge = await this.findById(challengeId)
    if (!challenge) return false

    if (challenge.creatorType === 'user') {
      return challenge.creatorId === userId
    } else {
      // Pour les gym challenges, vérifier que l'utilisateur possède la salle
      if (userRole !== 'gymOwner') return false
      // Cette logique sera complétée dans le service
      return true
    }
  }
}
