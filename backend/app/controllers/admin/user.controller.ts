import type { HttpContext } from '@adonisjs/core/http'
import { updateUserRoleValidator } from '#validators/admin/user'
import { UserService } from '../../services/user.service.js'
import { BaseController } from '../base_controller.js'

export default class AdminUserController extends BaseController {
  private userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }
  async index({ request, response }: HttpContext) {
    try {
      const { role } = request.qs()
      const filters = role && ['admin', 'gymOwner', 'user'].includes(role) ? { role } : undefined

      const result = await this.userService.getAllUsers(filters)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const result = await this.userService.getUserById(id)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async updateRole({ params, request, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const { role } = await request.validateUsing(updateUserRoleValidator)

      const result = await this.userService.updateUserRole(id, role)
      return response.ok(result.data)
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async deactivate({ params, response, auth }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const currentUser = this.getUserFromAuth(auth)

      const result = await this.userService.deactivateUser(id, currentUser.id)
      return response.ok({
        message: 'User deactivated successfully',
        user: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async activate({ params, response }: HttpContext) {
    try {
      const id = this.getValidId(params.id)

      const result = await this.userService.activateUser(id)
      return response.ok({
        message: 'User activated successfully',
        user: result.data,
      })
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const id = this.getValidId(params.id)
      const currentUser = this.getUserFromAuth(auth)

      await this.userService.deleteUser(id, currentUser.id)
      return response.noContent()
    } catch (error) {
      return this.handleServiceError(error, response)
    }
  }
}
