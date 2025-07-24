import vine from '@vinejs/vine'

export const claimChallengeValidator = vine.compile(
  vine.object({
    notes: vine.string().maxLength(500).optional(),
    completedAt: vine.date().optional(),
  })
)

export const updateParticipationValidator = vine.compile(
  vine.object({
    status: vine.enum(['in_progress', 'completed', 'abandoned']).optional(),
    notes: vine.string().maxLength(500).optional(),
    completedAt: vine.date().optional(),
  })
)
