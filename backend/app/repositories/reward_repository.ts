import Reward from '#models/reward'
import { BaseRepositoryInterface } from './base_repository.js'
import { CreateRewardDTO, UpdateRewardDTO, RewardFilterOptions } from '../types/reward.dto.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'

export class RewardRepository
  implements BaseRepositoryInterface<Reward, CreateRewardDTO, UpdateRewardDTO>
{
  async create(data: CreateRewardDTO): Promise<Reward> {
    return await Reward.create(data)
  }

  async findById(id: number): Promise<Reward | null> {
    return await Reward.find(id)
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<Reward[]> {
    let query = Reward.query()

    if (filters) {
      const rewardFilters = filters as RewardFilterOptions

      if (rewardFilters.type) {
        query = query.where('type', rewardFilters.type)
      }

      if (rewardFilters.isActive !== undefined) {
        query = query.where('isActive', rewardFilters.isActive)
      }

      if (rewardFilters.maxPointsCost !== undefined) {
        query = query.where('pointsCost', '<=', rewardFilters.maxPointsCost)
      }

      if (rewardFilters.isRepeatable !== undefined) {
        query = query.where('isRepeatable', rewardFilters.isRepeatable)
      }
    }

    if (pagination) {
      query = query.offset(pagination.offset || 0)
      if (pagination.limit) {
        query = query.limit(pagination.limit)
      }
    }

    return await query.orderBy('pointsCost', 'asc')
  }

  async update(id: number, data: UpdateRewardDTO): Promise<Reward | null> {
    const reward = await Reward.find(id)
    if (!reward) return null

    reward.merge(data)
    await reward.save()
    return reward
  }

  async delete(id: number): Promise<boolean> {
    const reward = await Reward.find(id)
    if (!reward) return false

    await reward.delete()
    return true
  }

  async findActive(): Promise<Reward[]> {
    return await Reward.query().where('isActive', true).orderBy('pointsCost', 'asc')
  }

  async findAvailableForUser(userId: number, userPoints: number): Promise<Reward[]> {
    return await Reward.query()
      .where('isActive', true)
      .where('pointsCost', '<=', userPoints)
      .whereNotExists((subquery) => {
        subquery
          .select('*')
          .from('user_rewards')
          .whereRaw('user_rewards.reward_id = rewards.id')
          .where('user_rewards.user_id', userId)
          .where('rewards.is_repeatable', false)
      })
      .orderBy('pointsCost', 'asc')
  }

  async findUserRewards(userId: number): Promise<Reward[]> {
    return await Reward.query()
      .innerJoin('user_rewards', 'rewards.id', 'user_rewards.reward_id')
      .where('user_rewards.user_id', userId)
      .where('user_rewards.is_active', true)
      .select(
        'rewards.*',
        'user_rewards.claimed_at',
        'user_rewards.context',
        'user_rewards.is_active as isClaimedActive'
      )
      .orderBy('user_rewards.claimed_at', 'desc')
  }

  async checkUserHasReward(userId: number, rewardId: number): Promise<boolean> {
    const result = await Reward.query()
      .innerJoin('user_rewards', 'rewards.id', 'user_rewards.reward_id')
      .where('user_rewards.user_id', userId)
      .where('user_rewards.reward_id', rewardId)
      .where('user_rewards.is_active', true)
      .first()

    return !!result
  }

  async claimRewardForUser(
    userId: number,
    rewardId: number,
    context?: Record<string, any>
  ): Promise<boolean> {
    try {
      const reward = await Reward.find(rewardId)
      if (!reward) return false

      await reward.related('users').attach({
        [userId]: {
          claimed_at: new Date(),
          context: context ? JSON.stringify(context) : null,
          is_active: true,
        },
      })

      return true
    } catch (error) {
      return false
    }
  }

  async deactivateUserReward(userId: number, rewardId: number): Promise<boolean> {
    try {
      const reward = await Reward.find(rewardId)
      if (!reward) return false

      await reward.related('users').sync(
        {
          [userId]: {
            is_active: false,
          },
        },
        false
      ) // false = don't detach existing records

      return true
    } catch (error) {
      return false
    }
  }
}
