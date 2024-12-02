import { UpdateCastMemberInput } from '@core/cast-member/application/use-cases/update-cast-member/updated-cast-member.input'
import { OmitType } from '@nestjs/mapped-types'

export class UpdateCastMemberInputWithoutId extends OmitType(
  UpdateCastMemberInput,
  ['id'] as any
) {}

export class UpdateCastMemberDto extends UpdateCastMemberInputWithoutId {}
