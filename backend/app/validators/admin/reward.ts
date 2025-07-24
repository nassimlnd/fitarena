import vine from '@vinejs/vine'

export const createRewardValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    description: vine.string().minLength(5).maxLength(500),
    type: vine.enum(['discount', 'merchandise', 'privilege', 'experience']),
    pointsCost: vine.number().min(1).max(100000),
    value: vine.string().maxLength(100).optional(), // e.g., "20%", "$50", "Free Session"
    maxRedemptions: vine.number().min(1).optional(),
    validUntil: vine.date().optional(),
    isActive: vine.boolean().optional(),
    requirements: vine
      .object({
        minLevel: vine.number().min(1).optional(),
        requiredBadges: vine.array(vine.number()).optional(),
        minChallengesCompleted: vine.number().min(0).optional(),
      })
      .optional(),
    metadata: vine
      .object({
        category: vine.string().maxLength(50).optional(),
        vendor: vine.string().maxLength(100).optional(),
        terms: vine.string().maxLength(1000).optional(),
      })
      .optional(),
  })
)

export const updateRewardValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100).optional(),
    description: vine.string().minLength(5).maxLength(500).optional(),
    type: vine.enum(['discount', 'merchandise', 'privilege', 'experience']).optional(),
    pointsCost: vine.number().min(1).max(100000).optional(),
    value: vine.string().maxLength(100).optional(),
    maxRedemptions: vine.number().min(1).optional(),
    validUntil: vine.date().optional(),
    isActive: vine.boolean().optional(),
    requirements: vine
      .object({
        minLevel: vine.number().min(1).optional(),
        requiredBadges: vine.array(vine.number()).optional(),
        minChallengesCompleted: vine.number().min(0).optional(),
      })
      .optional(),
    metadata: vine
      .object({
        category: vine.string().maxLength(50).optional(),
        vendor: vine.string().maxLength(100).optional(),
        terms: vine.string().maxLength(1000).optional(),
      })
      .optional(),
  })
)
