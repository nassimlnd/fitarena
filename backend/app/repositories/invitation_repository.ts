import ChallengeInvitation from '#models/challenge_invitation'
import { BaseRepositoryInterface } from './base_repository.js'
import { CreateInvitationDTO, UpdateInvitationDTO, InvitationFilterOptions } from '../types/invitation.dto.js'
import { FilterOptions, PaginationOptions } from '../types/common_types.js'

type CreateInvitationData = CreateInvitationDTO & {
  inviterId: number
  status: 'pending' | 'accepted' | 'declined'
}

export class InvitationRepository implements BaseRepositoryInterface<ChallengeInvitation, CreateInvitationData, UpdateInvitationDTO> {

  async create(data: CreateInvitationData): Promise<ChallengeInvitation> {
    return await ChallengeInvitation.create(data)
  }

  async findById(id: number): Promise<ChallengeInvitation | null> {
    return await ChallengeInvitation.find(id)
  }

  async findMany(filters?: FilterOptions, pagination?: PaginationOptions): Promise<ChallengeInvitation[]> {
    let query = ChallengeInvitation.query()

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

  async update(id: number, data: UpdateInvitationDTO): Promise<ChallengeInvitation | null> {
    const invitation = await this.findById(id)
    if (!invitation) return null

    invitation.merge(data)
    await invitation.save()
    return invitation
  }

  async delete(id: number): Promise<boolean> {
    const invitation = await this.findById(id)
    if (!invitation) return false

    await invitation.delete()
    return true
  }

  async findByInviter(inviterId: number): Promise<ChallengeInvitation[]> {
    return await ChallengeInvitation.query()
      .where('inviterId', inviterId)
      .preload('invitee')
      .preload('challenge')
      .orderBy('createdAt', 'desc')
  }

  async findByInvitee(inviteeId: number): Promise<ChallengeInvitation[]> {
    return await ChallengeInvitation.query()
      .where('inviteeId', inviteeId)
      .preload('inviter')
      .preload('challenge')
      .orderBy('createdAt', 'desc')
  }

  async findByChallenge(challengeId: number): Promise<ChallengeInvitation[]> {
    return await ChallengeInvitation.query()
      .where('challengeId', challengeId)
      .preload('inviter')
      .preload('invitee')
      .orderBy('createdAt', 'desc')
  }

  async findWithFilters(filters: InvitationFilterOptions): Promise<ChallengeInvitation[]> {
    let query = ChallengeInvitation.query()
      .preload('inviter')
      .preload('invitee')
      .preload('challenge')

    if (filters.inviterId) {
      query = query.where('inviterId', filters.inviterId)
    }

    if (filters.inviteeId) {
      query = query.where('inviteeId', filters.inviteeId)
    }

    if (filters.challengeId) {
      query = query.where('challengeId', filters.challengeId)
    }

    if (filters.status) {
      query = query.where('status', filters.status)
    }

    return await query.orderBy('createdAt', 'desc')
  }

  async findExistingInvitation(inviterId: number, inviteeId: number, challengeId: number): Promise<ChallengeInvitation | null> {
    return await ChallengeInvitation.query()
      .where('inviterId', inviterId)
      .where('inviteeId', inviteeId)
      .where('challengeId', challengeId)
      .first()
  }

  async getUserStats(userId: number): Promise<{
    totalSent: number
    totalReceived: number
    pendingSent: number
    pendingReceived: number
    acceptedSent: number
    acceptedReceived: number
    declinedSent: number
    declinedReceived: number
  }> {
    const [sent, received] = await Promise.all([
      ChallengeInvitation.query()
        .where('inviterId', userId)
        .select('status')
        .exec(),
      
      ChallengeInvitation.query()
        .where('inviteeId', userId)
        .select('status')
        .exec()
    ])

    const sentStats = sent.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1
      return acc
    }, { pending: 0, accepted: 0, declined: 0 })

    const receivedStats = received.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1
      return acc
    }, { pending: 0, accepted: 0, declined: 0 })

    return {
      totalSent: sent.length,
      totalReceived: received.length,
      pendingSent: sentStats.pending,
      pendingReceived: receivedStats.pending,
      acceptedSent: sentStats.accepted,
      acceptedReceived: receivedStats.accepted,
      declinedSent: sentStats.declined,
      declinedReceived: receivedStats.declined,
    }
  }
}