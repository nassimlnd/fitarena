import { GymRepository } from '../repositories/gym_repository.js'
import { ChallengeRepository } from '../repositories/challenge_repository.js'
import { AuthContext, OwnershipValidation, PermissionCheck } from '../types/auth.dto.js'
import { ServiceException } from '../types/common_types.js'

export class AuthorizationService {
  private gymRepository: GymRepository
  private challengeRepository: ChallengeRepository

  constructor() {
    this.gymRepository = new GymRepository()
    this.challengeRepository = new ChallengeRepository()
  }

  async validateGymOwnership(gymId: number, userId: number): Promise<OwnershipValidation> {
    try {
      const gym = await this.gymRepository.findById(gymId)
      if (!gym) {
        return {
          isOwner: false,
          message: 'Gym not found',
        }
      }

      const isOwner = gym.ownerId === userId
      return {
        isOwner,
        resourceId: gym.id,
        message: isOwner ? 'User owns this gym' : 'User does not own this gym',
      }
    } catch (error) {
      return {
        isOwner: false,
        message: 'Failed to validate gym ownership',
      }
    }
  }

  async validateChallengeOwnership(
    challengeId: number,
    userId: number,
    userRole: string
  ): Promise<OwnershipValidation> {
    try {
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) {
        return {
          isOwner: false,
          message: 'Challenge not found',
        }
      }

      let isOwner = false
      let message = ''

      if (challenge.creatorType === 'user') {
        isOwner = challenge.creatorId === userId
        message = isOwner ? 'User owns this challenge' : 'User does not own this challenge'
      } else {
        if (userRole !== 'gymOwner') {
          message = 'User is not a gym owner'
        } else {
          const gymValidation = await this.validateGymOwnership(challenge.gymId!, userId)
          isOwner = gymValidation.isOwner
          message = isOwner
            ? 'User owns the gym that created this challenge'
            : 'User does not own the gym that created this challenge'
        }
      }

      return {
        isOwner,
        resourceId: challenge.id,
        message,
      }
    } catch (error) {
      return {
        isOwner: false,
        message: 'Failed to validate challenge ownership',
      }
    }
  }

  async checkAdminPermission(userRole: string): Promise<PermissionCheck> {
    const hasPermission = userRole === 'admin'
    return {
      hasPermission,
      reason: hasPermission ? 'User has admin role' : 'User does not have admin role',
    }
  }

  async checkGymOwnerPermission(userRole: string): Promise<PermissionCheck> {
    const hasPermission = userRole === 'gymOwner' || userRole === 'admin'
    return {
      hasPermission,
      reason: hasPermission
        ? 'User has gym owner or admin role'
        : 'User does not have gym owner role',
    }
  }

  async validateUserHasApprovedGym(userId: number): Promise<OwnershipValidation> {
    try {
      const gym = await this.gymRepository.findByOwner(userId)
      if (!gym) {
        return {
          isOwner: false,
          message: 'User does not own any gym',
        }
      }

      const isApproved = gym.status === 'approved'
      return {
        isOwner: isApproved,
        resourceId: gym.id,
        message: isApproved ? 'User owns an approved gym' : `User's gym is ${gym.status}`,
      }
    } catch (error) {
      return {
        isOwner: false,
        message: 'Failed to validate gym approval status',
      }
    }
  }

  async ensureGymOwnership(gymId: number, userId: number): Promise<void> {
    const validation = await this.validateGymOwnership(gymId, userId)
    if (!validation.isOwner) {
      throw new ServiceException(
        validation.message || 'Unauthorized gym access',
        'UNAUTHORIZED_GYM_ACCESS',
        403
      )
    }
  }

  async ensureChallengeOwnership(
    challengeId: number,
    userId: number,
    userRole: string
  ): Promise<void> {
    const validation = await this.validateChallengeOwnership(challengeId, userId, userRole)
    if (!validation.isOwner) {
      throw new ServiceException(
        validation.message || 'Unauthorized challenge access',
        'UNAUTHORIZED_CHALLENGE_ACCESS',
        403
      )
    }
  }

  async ensureAdminPermission(userRole: string): Promise<void> {
    const permission = await this.checkAdminPermission(userRole)
    if (!permission.hasPermission) {
      throw new ServiceException(
        permission.reason || 'Admin access required',
        'ADMIN_ACCESS_REQUIRED',
        403
      )
    }
  }

  async ensureGymOwnerPermission(userRole: string): Promise<void> {
    const permission = await this.checkGymOwnerPermission(userRole)
    if (!permission.hasPermission) {
      throw new ServiceException(
        permission.reason || 'Gym owner access required',
        'GYM_OWNER_ACCESS_REQUIRED',
        403
      )
    }
  }

  async ensureApprovedGymOwnership(userId: number): Promise<void> {
    const validation = await this.validateUserHasApprovedGym(userId)
    if (!validation.isOwner) {
      throw new ServiceException(
        validation.message || 'Approved gym ownership required',
        'APPROVED_GYM_REQUIRED',
        403
      )
    }
  }

  createAuthContext(userId: number, role: string): AuthContext {
    return {
      userId,
      role: role as 'user' | 'gymOwner' | 'admin',
    }
  }
}
