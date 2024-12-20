import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'
import { Category, CategoryId } from '../../../../domain/category.aggregate'
import { CategoryModel } from '../../../../infra/database/sequelize/category.model'
import { CategorySequelizeRepository } from '../../../../infra/database/sequelize/category.sequelize.repository'
import { GetCategoryUseCase } from '../get-category.use-case'

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new GetCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new CategoryId()

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    )
  })

  it('should returns a category', async () => {
    const category = Category.fake().aCategory().build()

    await repository.insert(category)

    const output = await useCase.execute({ id: category.category_id.id })

    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at
    })
  })
})
