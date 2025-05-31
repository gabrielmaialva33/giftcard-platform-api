import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { BaseException } from './base.exception.js'

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
    // Handle our custom exceptions
    if (error instanceof BaseException) {
      return ctx.response.status(error.status).send(error.toJSON())
    }

    // Handle validation errors
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send({
        code: 'E_VALIDATION_FAILURE',
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    // Handle authorization errors
    if (error.code === 'E_AUTHORIZATION_FAILURE') {
      return ctx.response.status(403).send({
        code: 'E_AUTHORIZATION_FAILURE',
        message: 'Access denied',
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
    // Don't report client errors (4xx)
    if (error instanceof BaseException && error.status >= 400 && error.status < 500) {
      return
    }

    return super.report(error, ctx)
  }
}
