import vine from '@vinejs/vine'

export const createChallengeInvitationValidator = vine.compile(
  vine.object({
    inviteeId: vine.number().positive(),
    challengeId: vine.number().positive(),
  })
)

export const respondChallengeInvitationValidator = vine.compile(
  vine.object({
    status: vine.enum(['accepted', 'declined']),
  })
)
