import { Exception } from '@adonisjs/core/exceptions'

export class BaseException extends Exception {
  constructor(message: string, status: number = 500, code?: string) {
    super(message, { status, code })
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
    }
  }
}
