export interface CreateInvitationDTO {
  inviteeId: number
  challengeId: number
}

export interface UpdateInvitationDTO {
  status: 'pending' | 'accepted' | 'declined'
}

export interface InvitationData {
  id: number
  inviterId: number
  inviteeId: number
  challengeId: number
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  updatedAt: string
  // Relations data when populated
  inviter?: {
    id: number
    fullName?: string
    email: string
  }
  invitee?: {
    id: number
    fullName?: string
    email: string
  }
  challenge?: {
    id: number
    name: string
    description?: string
    difficulty?: 'easy' | 'medium' | 'hard'
  }
}

export interface InvitationFilterOptions {
  inviterId?: number
  inviteeId?: number
  challengeId?: number
  status?: 'pending' | 'accepted' | 'declined'
}

export interface InvitationStatsData {
  totalSent: number
  totalReceived: number
  pendingSent: number
  pendingReceived: number
  acceptedSent: number
  acceptedReceived: number
  declinedSent: number
  declinedReceived: number
}
