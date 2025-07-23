import vine from '@vinejs/vine'

export const createGroupChallengeValidator = vine.compile(
  vine.object({
    challengeId: vine.number().positive(),
    groupName: vine.string().minLength(2).maxLength(100),
  })
)
