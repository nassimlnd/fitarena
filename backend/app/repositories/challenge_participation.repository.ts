import ChallengeParticipation from '#models/challenge_participation'
import { BaseRepositoryInterface } from './base_repository.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'
import { DateTime } from 'luxon'
import {
  CreateChallengeParticipationData,
  UpdateChallengeParticipationData,
} from '../types/repositories/challenge_participation.types.js'

export class ChallengeParticipationRepository
  implements
    BaseRepositoryInterface<
      ChallengeParticipation,
      CreateChallengeParticipationData,
      UpdateChallengeParticipationData
    >
{
  async create(data: CreateChallengeParticipationData): Promise<ChallengeParticipation> {
    return await ChallengeParticipation.create({
      ...data,
      startedAt: data.startedAt || DateTime.now(),
    })
  }

  async findById(id: number): Promise<ChallengeParticipation | null> {
    try {
      return await ChallengeParticipation.findOrFail(id)
    } catch {
      return null
    }
  }

  async findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<ChallengeParticipation[]> {
    const query = ChallengeParticipation.query().preload('user').preload('challenge')

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined) {
          query.where(key, filters[key])
        }
      })
    }

    if (pagination?.limit) {
      query.limit(pagination.limit)
    }

    if (pagination?.offset) {
      query.offset(pagination.offset)
    }

    return await query.exec()
  }

  async update(
    id: number,
    data: UpdateChallengeParticipationData
  ): Promise<ChallengeParticipation | null> {
    try {
      const participation = await ChallengeParticipation.findOrFail(id)
      participation.merge(data)
      await participation.save()
      return participation
    } catch {
      return null
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const participation = await ChallengeParticipation.findOrFail(id)
      await participation.delete()
      return true
    } catch {
      return false
    }
  }

  async findByUserAndChallenge(
    userId: number,
    challengeId: number
  ): Promise<ChallengeParticipation | null> {
    try {
      return await ChallengeParticipation.query()
        .where('userId', userId)
        .andWhere('challengeId', challengeId)
        .first()
    } catch {
      return null
    }
  }

  async findUserParticipations(userId: number, status?: string): Promise<ChallengeParticipation[]> {
    const query = ChallengeParticipation.query().where('userId', userId).preload('challenge')

    if (status) {
      query.where('status', status)
    }

    return await query.exec()
  }

  async findChallengeParticipations(challengeId: number): Promise<ChallengeParticipation[]> {
    return await ChallengeParticipation.query()
      .where('challengeId', challengeId)
      .preload('user')
      .exec()
  }

  async getCompletedChallengesCount(userId: number): Promise<number> {
    const result = await ChallengeParticipation.query()
      .where('userId', userId)
      .andWhere('status', 'completed')
      .count('* as total')

    return result[0]?.$extras?.total || 0
  }
}
