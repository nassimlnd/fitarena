export interface CreateGroupChallengeData {
  challengeId: number
  groupName: string
  createdBy: number
}

export interface CreateGroupChallengeParticipantData {
  groupChallengeId: number
  userId: number
}
