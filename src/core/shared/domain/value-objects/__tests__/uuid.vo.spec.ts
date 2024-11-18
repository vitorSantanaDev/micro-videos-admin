import { InvalidUuidError, Uuid } from '../uuid.vo'
import { validate as uuidValidate } from 'uuid'

describe('Uuid Unit tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')
  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new Uuid()
    expect(uuidValidate(uuid.id)).toBe(true)
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should accept a valid uuid', () => {
    const uuid = new Uuid('123e4567-e89b-12d3-a456-426614174000')
    expect(uuid.id).toBe('123e4567-e89b-12d3-a456-426614174000')
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
