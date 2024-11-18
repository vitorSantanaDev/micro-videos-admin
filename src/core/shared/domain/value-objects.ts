import { isEqual } from 'lodash'

export abstract class ValueObject {
  public equals(other: this): boolean {
    if (other === null || other === undefined) return false
    if (other.constructor.name !== this.constructor.name) return false
    return isEqual(other, this)
  }
}
