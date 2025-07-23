import vine from '@vinejs/vine'

export const updateUserRoleValidator = vine.compile(
  vine.object({
    role: vine.enum(['admin', 'gymOwner', 'user']),
  })
)
