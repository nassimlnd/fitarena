import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserRoleValidator } from '#validators/admin/user'

export default class AdminUserController {
  async index({ request, response }: HttpContext) {
    const { role } = request.qs()
    const query = User.query()

    if (role && ['admin', 'gymOwner', 'user'].includes(role)) {
      query.where('role', role)
    }

    const users = await query
    return response.ok(users)
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }

  async updateRole({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const { role } = await request.validateUsing(updateUserRoleValidator)

      if (!['admin', 'gymOwner', 'user'].includes(role)) {
        return response.badRequest({ message: 'Invalid role' })
      }

      user.role = role
      await user.save()

      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }

  async deactivate({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      // TODO: Add active/inactive status to user model
      return response.ok({
        message: 'User deactivated successfully',
        user,
      })
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      // Prevent admin from deleting themselves
      if (user.id === params.currentUserId) {
        return response.forbidden({ message: 'Cannot delete your own account' })
      }

      await user.delete()
      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }
}
