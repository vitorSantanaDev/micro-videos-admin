import { Module } from '@nestjs/common'
import { ConfigModule } from './nest-modules/config-module/config.module'
import { DatabaseModule } from './nest-modules/database-module/database.module'
import { CategoriesModule } from './nest-modules/categories-module/categories.module'
import { SharedModule } from './nest-modules/shared-module/shared.module'
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    DatabaseModule,
    CategoriesModule,
    CastMembersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
