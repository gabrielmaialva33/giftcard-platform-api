import { BaseException } from './base.exception.js'

export class BadRequestException extends BaseException {
  static code = 'E_BAD_REQUEST'

  constructor(message: string, code?: string) {
    super(message, 400, code || BadRequestException.code)
  }
}
