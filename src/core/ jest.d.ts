/* eslint-disable @typescript-eslint/no-unused-vars */
import { FieldsErrors } from './core/shared/domain/validators/validator-fields-interface'

declare global {
  namespace jest {
    interface Matchers<R> {
      notificationContainsErrorMessages: (
        expected: Array<string | { [key: string]: string[] }>
      ) => R
    }
  }
}
