import { BaseException } from './base.exception.js'

export class UnauthorizedException extends BaseException {
  static code = 'E_UNAUTHORIZED'

  constructor(message: string, code?: string) {
    super(message, 401, code || UnauthorizedException.code)
  }
}
