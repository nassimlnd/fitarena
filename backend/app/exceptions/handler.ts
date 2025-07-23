import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const { response } = ctx

    // Handle Vine validation errors
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return response.status(422).json({
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    // Handle authentication errors
    if (error instanceof Error && error.message.includes('E_INVALID_CREDENTIALS')) {
      return response.status(401).json({
        message: 'Invalid credentials',
      })
    }

    // Handle unauthorized access
    if (error instanceof Error && error.message.includes('E_UNAUTHORIZED_ACCESS')) {
      return response.status(401).json({
        message: 'Unauthorized access',
      })
    }

    // Handle model not found errors
    if (error instanceof Error && error.message.includes('E_ROW_NOT_FOUND')) {
      return response.status(404).json({
        message: 'Resource not found',
      })
    }

    // Handle duplicate entry errors
    if (error instanceof Error && error.message.includes('ER_DUP_ENTRY')) {
      return response.status(409).json({
        message: 'Resource already exists',
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
