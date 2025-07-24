import vine from '@vinejs/vine'

export const createBadgeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    description: vine.string().minLength(5).maxLength(500),
    type: vine.enum(['achievement', 'milestone', 'special']),
    criteria: vine.object({
      type: vine.enum([
        'challenges_completed',
        'points_earned',
        'streak_days',
        'gym_visits',
        'custom',
      ]),
      value: vine.number().min(1),
      timeframe: vine.enum(['daily', 'weekly', 'monthly', 'all_time']).optional(),
    }),
    icon: vine.string().maxLength(255).optional(),
    color: vine
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    points: vine.number().min(0).max(10000).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateBadgeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100).optional(),
    description: vine.string().minLength(5).maxLength(500).optional(),
    type: vine.enum(['achievement', 'milestone', 'special']).optional(),
    criteria: vine
      .object({
        type: vine.enum([
          'challenges_completed',
          'points_earned',
          'streak_days',
          'gym_visits',
          'custom',
        ]),
        value: vine.number().min(1),
        timeframe: vine.enum(['daily', 'weekly', 'monthly', 'all_time']).optional(),
      })
      .optional(),
    icon: vine.string().maxLength(255).optional(),
    color: vine
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    points: vine.number().min(0).max(10000).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const awardBadgeValidator = vine.compile(
  vine.object({
    userId: vine.number().min(1),
    badgeId: vine.number().min(1),
    reason: vine.string().maxLength(255).optional(),
  })
)
