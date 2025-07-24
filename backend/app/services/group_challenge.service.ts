import { GroupChallengeRepository } from '../repositories/group_challenge.repository.js'
import {
  CreateGroupChallengeDTO,
  GroupChallengeData,
  GroupChallengeParticipantData,
} from '../types/group_challenge.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class GroupChallengeService {
  private groupChallengeRepository: GroupChallengeRepository

  constructor() {
    this.groupChallengeRepository = new GroupChallengeRepository()
  }

  async createGroup(data: CreateGroupChallengeDTO): Promise<ServiceResponse<GroupChallengeData>> {
    try {
      const group = await this.groupChallengeRepository.createGroup(data)

      // Add creator as first participant
      await this.groupChallengeRepository.addParticipant({
        groupChallengeId: group.id,
        userId: data.createdBy,
      })

      return {
        success: true,
        data: this.formatGroupChallengeData(group),
      }
    } catch (error) {
      throw new ServiceException('Failed to create group challenge', 'CREATE_ERROR', 500)
    }
  }

  async joinGroup(groupId: number, userId: number): Promise<ServiceResponse<{ message: string }>> {
    try {
      // Check if user is already in group
      const isAlreadyInGroup = await this.groupChallengeRepository.isUserInGroup(groupId, userId)
      if (isAlreadyInGroup) {
        throw new ServiceException('Already joined', 'ALREADY_JOINED', 409)
      }

      // Check if group exists
      const group = await this.groupChallengeRepository.findById(groupId)
      if (!group) {
        throw new ServiceException('Group challenge not found', 'NOT_FOUND', 404)
      }

      await this.groupChallengeRepository.addParticipant({
        groupChallengeId: groupId,
        userId,
      })

      return {
        success: true,
        data: { message: 'Joined group challenge' },
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to join group challenge', 'JOIN_ERROR', 500)
    }
  }

  async getUserGroups(userId: number): Promise<ServiceResponse<GroupChallengeData[]>> {
    try {
      const groups = await this.groupChallengeRepository.findByUserId(userId)

      return {
        success: true,
        data: groups.map((group) => this.formatGroupChallengeData(group)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch user groups', 'FETCH_ERROR', 500)
    }
  }

  async getGroupById(groupId: number): Promise<ServiceResponse<GroupChallengeData>> {
    try {
      const group = await this.groupChallengeRepository.findById(groupId)
      if (!group) {
        throw new ServiceException('Group challenge not found', 'NOT_FOUND', 404)
      }

      const participants = await this.groupChallengeRepository.getGroupParticipants(groupId)
      const groupData = this.formatGroupChallengeData(group)
      groupData.participants = participants.map((p) => this.formatParticipantData(p))

      return {
        success: true,
        data: groupData,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch group challenge', 'FETCH_ERROR', 500)
    }
  }

  private formatGroupChallengeData(group: any): GroupChallengeData {
    return {
      id: group.id,
      challengeId: group.challengeId,
      groupName: group.groupName,
      createdBy: group.createdBy,
      createdAt: group.createdAt.toISO(),
      updatedAt: group.updatedAt.toISO(),
    }
  }

  private formatParticipantData(participant: any): GroupChallengeParticipantData {
    return {
      id: participant.id,
      groupChallengeId: participant.groupChallengeId,
      userId: participant.userId,
      joinedAt: participant.createdAt.toISO(),
    }
  }
}
