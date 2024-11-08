import { lastValueFrom, of } from 'rxjs'
import { WrapperDataInterceptor } from './wrapper-data.interceptor'

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor()
  })

  it('should wrapper with data key', async () => {
    expect(interceptor).toBeDefined()
    const $observable = interceptor.intercept({} as any, {
      handle: () => of({ name: 'Test' })
    })

    const result = await lastValueFrom($observable)
    expect(result).toEqual({ data: { name: 'Test' } })
  })

  it('should not wrapper when meta key is present', async () => {
    expect(interceptor).toBeDefined()

    const data = { data: { name: 'Test' }, meta: { total: 1 } }

    const $observable = interceptor.intercept({} as any, {
      handle: () => of(data)
    })

    const result = await lastValueFrom($observable)
    expect(result).toEqual(data)
  })
})
