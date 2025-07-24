import vine from '@vinejs/vine'

export const createChallengeValidator = vine.compile(
  vine.object({
    creatorType: vine.enum(['user', 'gym']),
    name: vine.string().minLength(2).maxLength(200),

    score: vine.number().min(0).max(10000).optional(),
    description: vine.string().minLength(10).maxLength(2000).optional(),
    objectives: vine.string().minLength(5).maxLength(1000).optional(),
    recommendedExercises: vine.string().minLength(5).maxLength(1000).optional(),
    duration: vine.number().min(1).max(365).optional(),
    difficulty: vine.enum(['easy', 'medium', 'hard']).optional(),
    isPublic: vine.boolean().optional(),
    type: vine.string().minLength(2).maxLength(50).optional(),
  })
)

export const updateChallengeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(200).optional(),

    score: vine.number().min(0).max(10000).optional(),
    description: vine.string().minLength(10).maxLength(2000).optional(),
    objectives: vine.string().minLength(5).maxLength(1000).optional(),
    recommendedExercises: vine.string().minLength(5).maxLength(1000).optional(),
    duration: vine.number().min(1).max(365).optional(),
    difficulty: vine.enum(['easy', 'medium', 'hard']).optional(),
    isPublic: vine.boolean().optional(),
    type: vine.string().minLength(2).maxLength(50).optional(),
  })
)

export const createChallengeClientValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(200),
    description: vine.string().minLength(10).maxLength(2000),
    objectives: vine.string().minLength(5).maxLength(1000),
    recommendedExercises: vine.string().minLength(5).maxLength(1000),
    duration: vine.number().min(1).max(365),
    difficulty: vine.enum(['easy', 'medium', 'hard']),
    isPublic: vine.boolean().optional(),
    type: vine.string().minLength(2).maxLength(50),
  })
)

export const updateChallengeClientValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(200).optional(),
    description: vine.string().minLength(10).maxLength(2000).optional(),
    objectives: vine.string().minLength(5).maxLength(1000).optional(),
    recommendedExercises: vine.string().minLength(5).maxLength(1000).optional(),
    duration: vine.number().min(1).max(365).optional(),
    difficulty: vine.enum(['easy', 'medium', 'hard']).optional(),
    isPublic: vine.boolean().optional(),
    type: vine.string().minLength(2).maxLength(50).optional(),
  })
)

export const createChallengeGymValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(200),
    description: vine.string().minLength(10).maxLength(2000),
    objectives: vine.string().minLength(5).maxLength(1000),
    recommendedExercises: vine.string().minLength(5).maxLength(1000),
    duration: vine.number().min(1).max(365),
    difficulty: vine.enum(['easy', 'medium', 'hard']),
    isPublic: vine.boolean().optional(),
    type: vine.string().minLength(2).maxLength(50),
    score: vine.number().min(0).max(10000).optional(),
  })
)

export const updateChallengeGymValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(200).optional(),
    description: vine.string().minLength(10).maxLength(2000).optional(),
    objectives: vine.string().minLength(5).maxLength(1000).optional(),
    recommendedExercises: vine.string().minLength(5).maxLength(1000).optional(),
    duration: vine.number().min(1).max(365).optional(),
    difficulty: vine.enum(['easy', 'medium', 'hard']).optional(),
    isPublic: vine.boolean().optional(),
    type: vine.string().minLength(2).maxLength(50).optional(),
    score: vine.number().min(0).max(10000).optional(),
  })
)
