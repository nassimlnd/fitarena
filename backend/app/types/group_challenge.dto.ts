export interface CreateGroupChallengeDTO {
  challengeId: number
  groupName: string
  createdBy: number
}

export interface GroupChallengeData {
  id: number
  challengeId: number
  groupName: string
  createdBy: number
  createdAt: string
  updatedAt: string
  participants?: GroupChallengeParticipantData[]
}

export interface GroupChallengeParticipantData {
  id: number
  groupChallengeId: number
  userId: number
  joinedAt: string
}

export interface JoinGroupChallengeDTO {
  groupChallengeId: number
  userId: number
}
