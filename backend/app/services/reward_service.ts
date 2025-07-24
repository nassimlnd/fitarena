import { RewardRepository } from '../repositories/reward_repository.js'
import { UserRepository } from '../repositories/user_repository.js'
import { BadgeRepository } from '../repositories/badge_repository.js'
import {
  CreateRewardDTO,
  UpdateRewardDTO,
  RewardData,
  RewardConditions,
  RewardClaimedData,
} from '../types/reward.dto.js'
import { UpdateUserData } from '../types/user.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class RewardService {
  private rewardRepository: RewardRepository
  private userRepository: UserRepository
  private badgeRepository: BadgeRepository

  constructor() {
    this.rewardRepository = new RewardRepository()
    this.userRepository = new UserRepository()
    this.badgeRepository = new BadgeRepository()
  }

  async createReward(data: CreateRewardDTO): Promise<ServiceResponse<RewardData>> {
    try {
      this.validateRewardData(data)

      const reward = await this.rewardRepository.create(data)

      return {
        success: true,
        data: this.formatRewardData(reward),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to create reward', 'REWARD_CREATION_FAILED', 500)
    }
  }

  async getReward(rewardId: number): Promise<ServiceResponse<RewardData>> {
    try {
      const reward = await this.rewardRepository.findById(rewardId)
      if (!reward) {
        throw new ServiceException('Reward not found', 'REWARD_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatRewardData(reward),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to fetch reward', 'REWARD_FETCH_FAILED', 500)
    }
  }

  async getAllRewards(filters?: any): Promise<ServiceResponse<RewardData[]>> {
    try {
      const rewards = await this.rewardRepository.findMany(filters)

      return {
        success: true,
        data: rewards.map((reward) => this.formatRewardData(reward)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch rewards', 'REWARDS_FETCH_FAILED', 500)
    }
  }

  async getAvailableRewards(userId: number): Promise<ServiceResponse<RewardData[]>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const availableRewards = await this.rewardRepository.findAvailableForUser(
        userId,
        user.availablePoints
      )

      // Filter by conditions
      const eligibleRewards = []
      for (const reward of availableRewards) {
        const meetsConditions = await this.checkRewardConditions(
          userId,
          reward.conditions as RewardConditions
        )
        if (meetsConditions) {
          eligibleRewards.push(reward)
        }
      }

      return {
        success: true,
        data: eligibleRewards.map((reward) => this.formatRewardData(reward)),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      console.log(error)
      throw new ServiceException(
        'Failed to fetch available rewards',
        'AVAILABLE_REWARDS_FETCH_FAILED',
        500
      )
    }
  }

  async updateReward(
    rewardId: number,
    data: UpdateRewardDTO
  ): Promise<ServiceResponse<RewardData>> {
    try {
      const reward = await this.rewardRepository.update(rewardId, data)
      if (!reward) {
        throw new ServiceException('Reward not found', 'REWARD_NOT_FOUND', 404)
      }

      return {
        success: true,
        data: this.formatRewardData(reward),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to update reward', 'REWARD_UPDATE_FAILED', 500)
    }
  }

  async deleteReward(rewardId: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.rewardRepository.delete(rewardId)
      if (!deleted) {
        throw new ServiceException('Reward not found', 'REWARD_NOT_FOUND', 404)
      }

      return { success: true }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to delete reward', 'REWARD_DELETE_FAILED', 500)
    }
  }

  async getUserRewards(userId: number): Promise<ServiceResponse<RewardClaimedData[]>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const rewards = await this.rewardRepository.findUserRewards(userId)

      return {
        success: true,
        data: rewards.map((reward) => this.formatClaimedRewardData(reward)),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to fetch user rewards', 'USER_REWARDS_FETCH_FAILED', 500)
    }
  }

  async claimReward(userId: number, rewardId: number): Promise<ServiceResponse<RewardData>> {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new ServiceException('User not found', 'USER_NOT_FOUND', 404)
      }

      const reward = await this.rewardRepository.findById(rewardId)
      if (!reward) {
        throw new ServiceException('Reward not found', 'REWARD_NOT_FOUND', 404)
      }

      if (!reward.isActive) {
        throw new ServiceException('Reward is not active', 'REWARD_INACTIVE', 400)
      }

      // Check if user already has this reward (if not repeatable)
      if (!reward.isRepeatable) {
        const hasReward = await this.rewardRepository.checkUserHasReward(userId, rewardId)
        if (hasReward) {
          throw new ServiceException('Reward already claimed', 'REWARD_ALREADY_CLAIMED', 409)
        }
      }

      // Check if user has enough points
      if (user.availablePoints < reward.pointsCost) {
        throw new ServiceException('Insufficient points', 'INSUFFICIENT_POINTS', 400)
      }

      // Check reward conditions
      const meetsConditions = await this.checkRewardConditions(
        userId,
        reward.conditions as RewardConditions
      )
      if (!meetsConditions) {
        throw new ServiceException('Reward conditions not met', 'CONDITIONS_NOT_MET', 400)
      }

      // Claim the reward
      const claimSuccess = await this.rewardRepository.claimRewardForUser(userId, rewardId, {
        claimedAt: new Date().toISOString(),
      })

      if (!claimSuccess) {
        throw new ServiceException('Failed to claim reward', 'REWARD_CLAIM_FAILED', 500)
      }

      // Deduct points from user
      await this.userRepository.update(userId, {
        availablePoints: user.availablePoints - reward.pointsCost,
      } as UpdateUserData)

      return {
        success: true,
        data: this.formatRewardData(reward),
      }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to claim reward', 'REWARD_CLAIM_FAILED', 500)
    }
  }

  async deactivateUserReward(userId: number, rewardId: number): Promise<ServiceResponse<void>> {
    try {
      const success = await this.rewardRepository.deactivateUserReward(userId, rewardId)
      if (!success) {
        throw new ServiceException('Failed to deactivate reward', 'REWARD_DEACTIVATION_FAILED', 500)
      }

      return { success: true }
    } catch (error) {
      if (error instanceof ServiceException) throw error
      throw new ServiceException('Failed to deactivate reward', 'REWARD_DEACTIVATION_FAILED', 500)
    }
  }

  private async checkRewardConditions(
    userId: number,
    conditions: RewardConditions
  ): Promise<boolean> {
    switch (conditions.type) {
      case 'level':
        return await this.checkLevelCondition(userId, conditions.requirements)

      case 'badges':
        return await this.checkBadgeCondition(userId, conditions.requirements)

      case 'points':
        return await this.checkPointsCondition(userId, conditions.requirements)

      case 'achievements':
        return await this.checkAchievementCondition(userId, conditions.requirements)

      default:
        return true // No conditions or unsupported condition type
    }
  }

  private async checkLevelCondition(
    userId: number,
    requirements: Record<string, any>
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) return false

    const minLevel = requirements.minLevel || 1
    return user.level >= minLevel
  }

  private async checkBadgeCondition(
    userId: number,
    requirements: Record<string, any>
  ): Promise<boolean> {
    const requiredBadgeIds = requirements.badgeIds || []
    const minBadges = requirements.minBadges || requiredBadgeIds.length

    if (requiredBadgeIds.length > 0) {
      // Check specific badges
      for (const badgeId of requiredBadgeIds) {
        const hasBadge = await this.badgeRepository.checkUserHasBadge(userId, badgeId)
        if (!hasBadge) return false
      }
      return true
    }

    if (minBadges > 0) {
      // Check minimum number of badges
      const userBadges = await this.badgeRepository.findUserBadges(userId)
      return userBadges.length >= minBadges
    }

    return true
  }

  private async checkPointsCondition(
    userId: number,
    requirements: Record<string, any>
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) return false

    const minTotalPoints = requirements.minTotalPoints || 0
    return user.totalPoints >= minTotalPoints
  }

  private async checkAchievementCondition(
    _userId: number,
    _requirements: Record<string, any>
  ): Promise<boolean> {
    // This would need to be implemented based on your achievement system
    // For now, returning true as placeholder
    return true
  }

  private validateRewardData(data: CreateRewardDTO): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ServiceException('Reward name is required', 'INVALID_REWARD_NAME', 400)
    }

    if (!data.conditions || Object.keys(data.conditions).length === 0) {
      throw new ServiceException('Reward conditions are required', 'INVALID_REWARD_CONDITIONS', 400)
    }

    if (data.pointsCost && data.pointsCost < 0) {
      throw new ServiceException('Points cost cannot be negative', 'INVALID_POINTS_COST', 400)
    }
  }

  private formatRewardData(reward: any): RewardData {
    return {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      icon: reward.icon,
      type: reward.type,
      conditions: reward.conditions,
      pointsCost: reward.pointsCost,
      isActive: reward.isActive,
      isRepeatable: reward.isRepeatable,
      createdAt: reward.createdAt.toISO(),
      updatedAt: reward.updatedAt.toISO(),
      claimedAt: reward.$extras?.claimed_at,
      context: reward.$extras?.context ? JSON.parse(reward.$extras.context) : undefined,
      isClaimedActive: reward.$extras?.isClaimedActive,
    }
  }

  private formatClaimedRewardData(reward: any): RewardClaimedData {
    return {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      icon: reward.icon,
      type: reward.type,
      pointsCost: reward.pointsCost,
      isClaimed: true,
      claimedAt: reward.$extras?.claimed_at,
      isActive: reward.$extras?.isClaimedActive,
    }
  }
}
