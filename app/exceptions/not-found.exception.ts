import { BaseException } from './base.exception.js'

export class NotFoundException extends BaseException {
  static code = 'E_NOT_FOUND'

  constructor(message: string, code?: string) {
    super(message, 404, code || NotFoundException.code)
  }
}
