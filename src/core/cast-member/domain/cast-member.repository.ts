import { ISearchableRespository } from '@core/shared/domain/repository/repository.interface'
import { Either } from '../../shared/domain/either'
import {
  SearchParams as DefaultSearchParams,
  SearchParamsConstructorProps
} from '../../shared/domain/repository/search-params'
import { SearchResult as DefaultSearchResult } from '../../shared/domain/repository/search-result'
import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError
} from './cast-member-type.vo'
import { CastMember, CastMemberId } from './cast-member.aggregate'
import { SearchValidationError } from '@core/shared/domain/validators/validation.error'

export type CastMemberFilter = {
  name?: string
  type?: CastMemberType
}

export class CastMemberSearchParams extends DefaultSearchParams<CastMemberFilter> {
  private constructor(
    props: SearchParamsConstructorProps<CastMemberFilter> = {}
  ) {
    super(props)
  }

  static create(
    props: Omit<SearchParamsConstructorProps<CastMemberFilter>, 'filter'> & {
      filter?: {
        name?: string
        type?: CastMemberTypes
      }
    } = {}
  ) {
    const [type, errorCastMemberType] = Either.of(props.filter?.type)
      .map((type) => type || null)
      .chain<CastMemberType | null, InvalidCastMemberTypeError>((type) =>
        type ? CastMemberType.create(type) : Either.of(null)
      )
      .asArray()

    if (errorCastMemberType) {
      const error = new SearchValidationError([
        { type: [errorCastMemberType.message] }
      ])

      throw error
    }

    return new CastMemberSearchParams({
      ...props,
      filter: {
        name: props.filter?.name,
        type: type
      }
    })
  }

  get filter(): CastMemberFilter | null {
    return this._filter
  }

  protected set filter(value: CastMemberFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value

    const filter = {
      ...(_value.name && { name: `${_value?.name}` }),
      ...(_value.type && { type: _value.type })
    }

    this._filter = Object.keys(filter).length === 0 ? null : filter
  }
}

export class CastMemberSearchResult extends DefaultSearchResult<CastMember> {}

export type ICastMemberRepository = ISearchableRespository<
  CastMember,
  CastMemberId,
  CastMemberFilter,
  CastMemberSearchParams,
  CastMemberSearchResult
>
