import { Test, TestingModule } from '@nestjs/testing'
import { ICategoryRepository } from '../../../core/category/domain/category.repository'
import { CategoriesController } from '../categories.controller'
import { ConfigModule } from '../../config-module/config.module'
import { DatabaseModule } from '../../database-module/database.module'
import { CategoriesModule } from '../categories.module'
import { CATEGORY_PROVIDERS } from '../categories.providers'
import { CreateCategoryUseCase } from '../../../core/category/application/use-cases/create-category/create-category.use-case'
import { UpdateCategoryUseCase } from '../../../core/category/application/use-cases/update-category/update-category.use-case'

import { GetCategoryUseCase } from '../../../core/category/application/use-cases/get-category/get-category.use-case'
import { DeleteCategoryUseCase } from '../../../core/category/application/use-cases/delete-category/delete-category.use-case'

import {
  CategoryCollectionPresenter,
  CategoryPresenter
} from '../categories.presenter'
import { CategoryOutputMapper } from '../../../core/category/application/use-cases/common/category-output'
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-category/list-categories.use-case'
import {
  CreateCategoryFixture,
  ListCategoriesFixture,
  UpdateCategoryFixture
} from '../testing/category-fixture'
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo'
import { Category } from '@core/category/domain/category.entity'

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController
  let repository: ICategoryRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule]
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)

    repository = module.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()

    expect(controller['createCategoryUseCase']).toBeInstanceOf(
      CreateCategoryUseCase
    )

    expect(controller['updateCategoryUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase
    )

    expect(controller['listCategoryUseCase']).toBeInstanceOf(
      ListCategoriesUseCase
    )

    expect(controller['getCategoryUseCase']).toBeInstanceOf(GetCategoryUseCase)

    expect(controller['deleteCategoryUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase
    )
  })

  describe('should create a category', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate()

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data)

        const category_id = new Uuid(presenter.id)

        const entity = await repository.findById(category_id)

        expect(entity!.toJSON()).toStrictEqual({
          category_id,
          created_at: presenter.created_at,
          ...expected
        })

        const output = CategoryOutputMapper.toOutput(entity!)

        expect(presenter).toEqual(new CategoryPresenter(output))
      }
    )
  })

  describe('should update a category', () => {
    const arrange = UpdateCategoryFixture.arrangeForUpdate()

    const category = Category.fake().aCategory().build()

    beforeEach(async () => {
      await repository.insert(category)
    })

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          category.category_id.id,
          send_data
        )

        const category_id = new Uuid(presenter.id)

        const entity = await repository.findById(category_id)

        expect(entity!.toJSON()).toStrictEqual({
          category_id,
          created_at: presenter.created_at,
          name: expected.name ?? category.name,
          description:
            'description' in expected
              ? expected.description
              : category.description,
          is_active:
            expected.is_active === true || expected.is_active === false
              ? expected.is_active
              : category.is_active
        })

        const output = CategoryOutputMapper.toOutput(entity!)

        expect(presenter).toEqual(new CategoryPresenter(output))
      }
    )
  })

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build()

    await repository.insert(category)

    const response = await controller.remove(category.category_id.id)

    expect(response).not.toBeDefined()

    await expect(repository.findById(category.category_id)).resolves.toBeNull()
  })

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build()

    await repository.insert(category)

    const presenter = await controller.findOne(category.category_id.id)

    expect(presenter.id).toBe(category.category_id.id)
    expect(presenter.name).toBe(category.name)
    expect(presenter.description).toBe(category.description)
    expect(presenter.is_active).toBe(category.is_active)
    expect(presenter.created_at).toStrictEqual(category.created_at)
  })

  describe('search method', () => {
    describe('should sorted categories by created_at', () => {
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt()

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap))
      })

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data)

          const { entities, ...paginationProps } = expected

          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map(CategoryOutputMapper.toOutput),
              ...paginationProps.meta
            })
          )
        }
      )
    })

    describe('should return categories using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted()

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap))
      })

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data)

          const { entities, ...paginationProps } = expected

          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map(CategoryOutputMapper.toOutput),
              ...paginationProps.meta
            })
          )
        }
      )
    })
  })
})
