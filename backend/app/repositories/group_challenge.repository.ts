import GroupChallenge from '#models/group_challenge'
import GroupChallengeParticipant from '#models/group_challenge_participant'
import {
  CreateGroupChallengeData,
  CreateGroupChallengeParticipantData,
} from '../types/repositories/group_challenge.types.js'

export class GroupChallengeRepository {
  async createGroup(data: CreateGroupChallengeData): Promise<GroupChallenge> {
    return await GroupChallenge.create(data)
  }

  async findById(id: number): Promise<GroupChallenge | null> {
    try {
      return await GroupChallenge.findOrFail(id)
    } catch {
      return null
    }
  }

  async findByUserId(userId: number): Promise<GroupChallenge[]> {
    const participantLinks = await GroupChallengeParticipant.query().where('userId', userId)
    const groupIds = participantLinks.map((p) => p.groupChallengeId)

    if (groupIds.length === 0) {
      return []
    }

    return await GroupChallenge.query().whereIn('id', groupIds)
  }

  async addParticipant(
    data: CreateGroupChallengeParticipantData
  ): Promise<GroupChallengeParticipant> {
    return await GroupChallengeParticipant.create(data)
  }

  async isUserInGroup(groupId: number, userId: number): Promise<boolean> {
    const participant = await GroupChallengeParticipant.query()
      .where('groupChallengeId', groupId)
      .andWhere('userId', userId)
      .first()

    return !!participant
  }

  async getGroupParticipants(groupId: number): Promise<GroupChallengeParticipant[]> {
    return await GroupChallengeParticipant.query().where('groupChallengeId', groupId)
  }

  async removeParticipant(groupId: number, userId: number): Promise<boolean> {
    try {
      const participant = await GroupChallengeParticipant.query()
        .where('groupChallengeId', groupId)
        .andWhere('userId', userId)
        .firstOrFail()

      await participant.delete()
      return true
    } catch {
      return false
    }
  }
}
