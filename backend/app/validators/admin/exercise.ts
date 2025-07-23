import vine from '@vinejs/vine'

export const createExerciseValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    description: vine.string().minLength(10).maxLength(1000),
    muscles: vine.array(vine.string().minLength(2).maxLength(50)).minLength(1),
  })
)

export const updateExerciseValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100).optional(),
    description: vine.string().minLength(10).maxLength(1000).optional(),
    muscles: vine.array(vine.string().minLength(2).maxLength(50)).minLength(1).optional(),
  })
)
