import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { getModelToken, SequelizeModule } from '@nestjs/sequelize'
import { CategoryModel } from '@core/category/infra/database/sequelize/category.model'
import { CategorySequelizeRepository } from '@core/category/infra/database/sequelize/category.sequelize.repository'

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: CategorySequelizeRepository,
      useFactory: (categoryModel: typeof CategoryModel) => {
        return new CategorySequelizeRepository(categoryModel)
      },
      inject: [getModelToken(CategoryModel)]
    }
  ]
})
export class CategoriesModule {}
