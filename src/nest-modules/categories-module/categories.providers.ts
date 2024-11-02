import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case'
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case'
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case'
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-category/list-categories.use-case'
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update-category/update-category.use-case'
import { ICategoryRepository } from '@core/category/domain/category.repository'
import { CategoryInMemoryRepository } from '@core/category/infra/database/in-memory/category-in-memory.repository'
import { CategoryModel } from '@core/category/infra/database/sequelize/category.model'
import { CategorySequelizeRepository } from '@core/category/infra/database/sequelize/category.sequelize.repository'
import { getModelToken } from '@nestjs/sequelize'

export const REPOSITORIES = {
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    useExisting: CategorySequelizeRepository
  },
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository
  },
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) => {
      return new CategorySequelizeRepository(categoryModel)
    },
    inject: [getModelToken(CategoryModel)]
  }
}

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUseCase,
    useFactory: (categoryRepository: ICategoryRepository) => {
      return new CreateCategoryUseCase(categoryRepository)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUseCase,
    useFactory: (categoryRepository: ICategoryRepository) => {
      return new UpdateCategoryUseCase(categoryRepository)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListCategoriesUseCase,
    useFactory: (categoryRepository: ICategoryRepository) => {
      return new ListCategoriesUseCase(categoryRepository)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUseCase,
    useFactory: (categoryRepository: ICategoryRepository) => {
      return new GetCategoryUseCase(categoryRepository)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUseCase,
    useFactory: (categoryRepository: ICategoryRepository) => {
      return new DeleteCategoryUseCase(categoryRepository)
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
  }
}

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES
}
