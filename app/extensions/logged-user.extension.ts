import { HttpContext } from '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    getLoggedUserId: (loggedUserId: number) => number
    loggedUserId: number
    loggedUser: any
    locale: string
  }
}

HttpContext.macro('getLoggedUserId', function loggedUserId(id: number) {
  return id
})
