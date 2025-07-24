import TrainingSession from '#models/training_session'
import { BaseRepositoryInterface } from './base_repository.js'
import {
  CreateTrainingSessionDTO,
  UpdateTrainingSessionDTO,
  TrainingSessionFilterOptions,
} from '../types/training_session.dto.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'
import { DateTime } from 'luxon'

type CreateTrainingSessionData = CreateTrainingSessionDTO & {
  userId: number
}

export class TrainingSessionRepository
  implements
    BaseRepositoryInterface<TrainingSession, CreateTrainingSessionData, UpdateTrainingSessionDTO>
{
  async create(data: CreateTrainingSessionData): Promise<TrainingSession> {
    const createData = {
      ...data,
      date: typeof data.date === 'string' ? DateTime.fromISO(data.date) : data.date,
    }
    return await TrainingSession.create(createData)
  }

  async findById(id: number): Promise<TrainingSession | null> {
    return await TrainingSession.find(id)
  }

  async findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<TrainingSession[]> {
    let query = TrainingSession.query()

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

  async update(id: number, data: UpdateTrainingSessionDTO): Promise<TrainingSession | null> {
    const session = await this.findById(id)
    if (!session) return null

    const updateData = {
      ...data,
      date: data.date
        ? typeof data.date === 'string'
          ? DateTime.fromISO(data.date)
          : data.date
        : undefined,
    }

    session.merge(updateData)
    await session.save()
    return session
  }

  async delete(id: number): Promise<boolean> {
    const session = await this.findById(id)
    if (!session) return false

    await session.delete()
    return true
  }

  async findByUser(userId: number): Promise<TrainingSession[]> {
    return await TrainingSession.query().where('userId', userId).orderBy('date', 'desc')
  }

  async findByChallenge(challengeId: number): Promise<TrainingSession[]> {
    return await TrainingSession.query().where('challengeId', challengeId).orderBy('date', 'desc')
  }

  async findWithFilters(filters: TrainingSessionFilterOptions): Promise<TrainingSession[]> {
    let query = TrainingSession.query().preload('user').preload('challenge')

    if (filters.userId) {
      query = query.where('userId', filters.userId)
    }

    if (filters.challengeId) {
      query = query.where('challengeId', filters.challengeId)
    }

    if (filters.dateFrom) {
      query = query.where('date', '>=', filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.where('date', '<=', filters.dateTo)
    }

    if (filters.minDuration) {
      query = query.where('duration', '>=', filters.minDuration)
    }

    if (filters.maxDuration) {
      query = query.where('duration', '<=', filters.maxDuration)
    }

    if (filters.minCalories) {
      query = query.where('calories_burned', '>=', filters.minCalories)
    }

    if (filters.maxCalories) {
      query = query.where('calories_burned', '<=', filters.maxCalories)
    }

    return await query.orderBy('date', 'desc')
  }

  async getUserStats(userId: number): Promise<{
    totalSessions: number
    totalDuration: number
    totalCalories: number
    sessionsThisWeek: number
    sessionsThisMonth: number
  }> {
    const now = DateTime.now()
    const weekStart = now.startOf('week')
    const monthStart = now.startOf('month')

    const [total, thisWeek, thisMonth] = await Promise.all([
      TrainingSession.query()
        .where('userId', userId)
        .sum('duration as totalDuration')
        .sum('calories_burned as totalCalories')
        .count('* as totalSessions')
        .first(),

      TrainingSession.query()
        .where('userId', userId)
        .where('date', '>=', weekStart.toSQLDate())
        .count('* as sessionsThisWeek')
        .first(),

      TrainingSession.query()
        .where('userId', userId)
        .where('date', '>=', monthStart.toSQLDate())
        .count('* as sessionsThisMonth')
        .first(),
    ])

    return {
      totalSessions: Number(total?.$extras.totalSessions || 0),
      totalDuration: Number(total?.$extras.totalDuration || 0),
      totalCalories: Number(total?.$extras.totalCalories || 0),
      sessionsThisWeek: Number(thisWeek?.$extras.sessionsThisWeek || 0),
      sessionsThisMonth: Number(thisMonth?.$extras.sessionsThisMonth || 0),
    }
  }
}
