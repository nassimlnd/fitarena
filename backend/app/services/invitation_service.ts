import { InvitationRepository } from '../repositories/invitation_repository.js'
import { ChallengeRepository } from '../repositories/challenge_repository.js'
import { UserRepository } from '../repositories/user_repository.js'
import { CreateInvitationDTO, InvitationData, InvitationStatsData } from '../types/invitation.dto.js'
import { ServiceResponse, ServiceException } from '../types/common_types.js'

export class InvitationService {
  private invitationRepository: InvitationRepository
  private challengeRepository: ChallengeRepository
  private userRepository: UserRepository

  constructor() {
    this.invitationRepository = new InvitationRepository()
    this.challengeRepository = new ChallengeRepository()
    this.userRepository = new UserRepository()
  }

  async createInvitation(data: CreateInvitationDTO, inviterId: number): Promise<ServiceResponse<InvitationData>> {
    try {
      // Vérifier que le challenge existe
      const challenge = await this.challengeRepository.findById(data.challengeId)
      if (!challenge) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      // Vérifier que l'invitee existe
      const invitee = await this.userRepository.findById(data.inviteeId)
      if (!invitee) {
        throw new ServiceException('User to invite not found', 'USER_NOT_FOUND', 404)
      }

      // Vérifier que l'utilisateur ne s'invite pas lui-même
      if (data.inviteeId === inviterId) {
        throw new ServiceException('You cannot invite yourself', 'SELF_INVITATION_NOT_ALLOWED', 422)
      }

      // Vérifier qu'une invitation n'existe pas déjà
      const existingInvitation = await this.invitationRepository.findExistingInvitation(
        inviterId,
        data.inviteeId,
        data.challengeId
      )

      if (existingInvitation) {
        throw new ServiceException('An invitation for this challenge already exists for this user', 'INVITATION_ALREADY_EXISTS', 409)
      }

      const invitationData = {
        ...data,
        inviterId,
        status: 'pending' as const,
      }

      const invitation = await this.invitationRepository.create(invitationData)

      return {
        success: true,
        data: this.formatInvitationData(invitation),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to create invitation', 'INVITATION_CREATION_FAILED', 500)
    }
  }

  async getInvitation(invitationId: number, userId: number): Promise<ServiceResponse<InvitationData>> {
    try {
      const invitation = await this.invitationRepository.findById(invitationId)
      if (!invitation) {
        throw new ServiceException('Invitation not found', 'INVITATION_NOT_FOUND', 404)
      }

      // Vérifier que l'utilisateur peut accéder à cette invitation
      if (invitation.inviterId !== userId && invitation.inviteeId !== userId) {
        throw new ServiceException('You are not authorized to view this invitation', 'INVITATION_UNAUTHORIZED', 403)
      }

      return {
        success: true,
        data: this.formatInvitationData(invitation),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch invitation', 'INVITATION_FETCH_FAILED', 500)
    }
  }

  async getSentInvitations(inviterId: number): Promise<ServiceResponse<InvitationData[]>> {
    try {
      const invitations = await this.invitationRepository.findByInviter(inviterId)

      return {
        success: true,
        data: invitations.map(invitation => this.formatInvitationData(invitation)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch sent invitations', 'INVITATION_FETCH_FAILED', 500)
    }
  }

  async getReceivedInvitations(inviteeId: number): Promise<ServiceResponse<InvitationData[]>> {
    try {
      const invitations = await this.invitationRepository.findByInvitee(inviteeId)

      return {
        success: true,
        data: invitations.map(invitation => this.formatInvitationData(invitation)),
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch received invitations', 'INVITATION_FETCH_FAILED', 500)
    }
  }

  async getChallengeInvitations(challengeId: number, userId: number): Promise<ServiceResponse<InvitationData[]>> {
    try {
      // Vérifier que le challenge existe et que l'utilisateur peut y accéder
      const challenge = await this.challengeRepository.findById(challengeId)
      if (!challenge) {
        throw new ServiceException('Challenge not found', 'CHALLENGE_NOT_FOUND', 404)
      }

      // Vérifier l'ownership du challenge
      const hasAccess = await this.validateChallengeAccess(challenge, userId)
      if (!hasAccess) {
        throw new ServiceException('You are not authorized to view invitations for this challenge', 'CHALLENGE_UNAUTHORIZED', 403)
      }

      const invitations = await this.invitationRepository.findByChallenge(challengeId)

      return {
        success: true,
        data: invitations.map(invitation => this.formatInvitationData(invitation)),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to fetch challenge invitations', 'INVITATION_FETCH_FAILED', 500)
    }
  }

  async respondToInvitation(invitationId: number, status: 'accepted' | 'declined', userId: number): Promise<ServiceResponse<InvitationData>> {
    try {
      const invitation = await this.invitationRepository.findById(invitationId)
      if (!invitation) {
        throw new ServiceException('Invitation not found', 'INVITATION_NOT_FOUND', 404)
      }

      // Vérifier que l'utilisateur est bien l'invité
      if (invitation.inviteeId !== userId) {
        throw new ServiceException('You are not authorized to respond to this invitation', 'INVITATION_UNAUTHORIZED', 403)
      }

      // Vérifier que l'invitation est en attente
      if (invitation.status !== 'pending') {
        throw new ServiceException('This invitation has already been responded to', 'INVITATION_ALREADY_RESPONDED', 409)
      }

      const updatedInvitation = await this.invitationRepository.update(invitationId, { status })
      if (!updatedInvitation) {
        throw new ServiceException('Failed to update invitation', 'INVITATION_UPDATE_FAILED', 500)
      }

      return {
        success: true,
        data: this.formatInvitationData(updatedInvitation),
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to respond to invitation', 'INVITATION_RESPONSE_FAILED', 500)
    }
  }

  async cancelInvitation(invitationId: number, userId: number): Promise<ServiceResponse<boolean>> {
    try {
      const invitation = await this.invitationRepository.findById(invitationId)
      if (!invitation) {
        throw new ServiceException('Invitation not found', 'INVITATION_NOT_FOUND', 404)
      }

      // Vérifier que l'utilisateur est bien l'inviteur
      if (invitation.inviterId !== userId) {
        throw new ServiceException('You are not authorized to cancel this invitation', 'INVITATION_UNAUTHORIZED', 403)
      }

      // Vérifier que l'invitation est en attente
      if (invitation.status !== 'pending') {
        throw new ServiceException('Cannot cancel an invitation that has already been responded to', 'INVITATION_CANNOT_CANCEL', 409)
      }

      const deleted = await this.invitationRepository.delete(invitationId)
      if (!deleted) {
        throw new ServiceException('Failed to cancel invitation', 'INVITATION_CANCEL_FAILED', 500)
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      if (error instanceof ServiceException) {
        throw error
      }
      throw new ServiceException('Failed to cancel invitation', 'INVITATION_CANCEL_FAILED', 500)
    }
  }

  async getUserInvitationStats(userId: number): Promise<ServiceResponse<InvitationStatsData>> {
    try {
      const stats = await this.invitationRepository.getUserStats(userId)

      return {
        success: true,
        data: stats,
      }
    } catch (error) {
      throw new ServiceException('Failed to fetch invitation stats', 'INVITATION_STATS_FETCH_FAILED', 500)
    }
  }

  private async validateChallengeAccess(challenge: any, userId: number): Promise<boolean> {
    // L'utilisateur peut voir les invitations si :
    // 1. Il est le créateur du challenge (pour les user challenges)
    // 2. Il possède la salle qui a créé le challenge (pour les gym challenges)
    // 3. Il est admin (à implémenter si nécessaire)

    if (challenge.creatorType === 'user') {
      return challenge.creatorId === userId
    } else {
      // Pour les gym challenges, vérifier l'ownership de la salle
      // Cette logique pourrait être déplacée dans AuthService
      return true // Simplified for now
    }
  }

  private formatInvitationData(invitation: any): InvitationData {
    const data: InvitationData = {
      id: invitation.id,
      inviterId: invitation.inviterId,
      inviteeId: invitation.inviteeId,
      challengeId: invitation.challengeId,
      status: invitation.status,
      createdAt: invitation.createdAt.toISO(),
      updatedAt: invitation.updatedAt.toISO(),
    }

    // Ajouter les données des relations si elles sont chargées
    if (invitation.inviter) {
      data.inviter = {
        id: invitation.inviter.id,
        fullName: invitation.inviter.fullName,
        email: invitation.inviter.email,
      }
    }

    if (invitation.invitee) {
      data.invitee = {
        id: invitation.invitee.id,
        fullName: invitation.invitee.fullName,
        email: invitation.invitee.email,
      }
    }

    if (invitation.challenge) {
      data.challenge = {
        id: invitation.challenge.id,
        name: invitation.challenge.name,
        description: invitation.challenge.description,
        difficulty: invitation.challenge.difficulty,
      }
    }

    return data
  }
}