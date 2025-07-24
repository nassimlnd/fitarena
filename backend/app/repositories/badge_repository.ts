import Badge from '#models/badge'
import { BaseRepositoryInterface } from './base_repository.js'
import { CreateBadgeDTO, UpdateBadgeDTO, BadgeFilterOptions } from '../types/badge.dto.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'

export class BadgeRepository
  implements BaseRepositoryInterface<Badge, CreateBadgeDTO, UpdateBadgeDTO>
{
  async create(data: CreateBadgeDTO): Promise<Badge> {
    return await Badge.create(data)
  }

  async findById(id: number): Promise<Badge | null> {
    return await Badge.find(id)
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<Badge[]> {
    let query = Badge.query()

    if (filters) {
      const badgeFilters = filters as BadgeFilterOptions

      if (badgeFilters.type) {
        query = query.where('type', badgeFilters.type)
      }

      if (badgeFilters.isActive !== undefined) {
        query = query.where('isActive', badgeFilters.isActive)
      }

      if (badgeFilters.minPoints !== undefined) {
        query = query.where('points', '>=', badgeFilters.minPoints)
      }

      if (badgeFilters.maxPoints !== undefined) {
        query = query.where('points', '<=', badgeFilters.maxPoints)
      }
    }

    if (pagination) {
      query = query.offset(pagination.offset || 0)
      if (pagination.limit) {
        query = query.limit(pagination.limit)
      }
    }

    return await query.orderBy('createdAt', 'desc')
  }

  async update(id: number, data: UpdateBadgeDTO): Promise<Badge | null> {
    const badge = await Badge.find(id)
    if (!badge) return null

    badge.merge(data)
    await badge.save()
    return badge
  }

  async delete(id: number): Promise<boolean> {
    const badge = await Badge.find(id)
    if (!badge) return false

    await badge.delete()
    return true
  }

  async findActive(): Promise<Badge[]> {
    return await Badge.query().where('isActive', true).orderBy('createdAt', 'desc')
  }

  async findByType(type: 'achievement' | 'milestone' | 'special'): Promise<Badge[]> {
    return await Badge.query().where('type', type).where('isActive', true).orderBy('points', 'asc')
  }

  async findUserBadges(userId: number): Promise<Badge[]> {
    return await Badge.query()
      .innerJoin('user_badges', 'badges.id', 'user_badges.badge_id')
      .where('user_badges.user_id', userId)
      .select('badges.*', 'user_badges.earned_at', 'user_badges.context')
      .orderBy('user_badges.earned_at', 'desc')
  }

  async checkUserHasBadge(userId: number, badgeId: number): Promise<boolean> {
    const result = await Badge.query()
      .innerJoin('user_badges', 'badges.id', 'user_badges.badge_id')
      .where('user_badges.user_id', userId)
      .where('user_badges.badge_id', badgeId)
      .first()

    return !!result
  }

  async awardBadgeToUser(
    userId: number,
    badgeId: number,
    context?: Record<string, any>
  ): Promise<boolean> {
    try {
      const badge = await Badge.find(badgeId)
      if (!badge) return false

      await badge.related('users').attach({
        [userId]: {
          earned_at: new Date(),
          context: context ? JSON.stringify(context) : null,
        },
      })

      return true
    } catch (error) {
      // Handle duplicate entry error (badge already awarded)
      return false
    }
  }
}
