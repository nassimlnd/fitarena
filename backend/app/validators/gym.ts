import vine from '@vinejs/vine'

export const createGymValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    contact: vine.string().minLength(5).maxLength(100),
    description: vine.string().minLength(10).maxLength(1000).optional(),
  })
)

export const updateGymValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100).optional(),
    contact: vine.string().minLength(5).maxLength(100).optional(),
    description: vine.string().minLength(10).maxLength(1000).optional(),
  })
)
