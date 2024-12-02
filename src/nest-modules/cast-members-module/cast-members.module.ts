import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CAST_MEMBERS_PROVIDERS } from './cast-members.providers'
import { CastMemberModel } from '@core/cast-member/infra/database/sequelize/cast-member.model'
import { CastMembersController } from './cast-members.controller'
@Module({
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBERS_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBERS_PROVIDERS.USE_CASES),
    ...Object.values(CAST_MEMBERS_PROVIDERS.VALIDATIONS)
  ],
  exports: [
    CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    CAST_MEMBERS_PROVIDERS.VALIDATIONS
      .CAST_MEMBERS_IDS_EXISTS_IN_DATABASE_VALIDATOR
  ]
})
export class CastMembersModule {}
