import request from 'supertest'
import { instanceToPlain } from 'class-transformer'
import { ICategoryRepository } from '../../src/core/category/domain/category.repository'
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers'
import { CategoryOutputMapper } from '../../src/core/category/application/use-cases/common/category-output'
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers'
import { CategoriesController } from '../../src/nest-modules/categories-module/categories.controller'

import { GetCategoryFixture } from '../../src/nest-modules/categories-module/testing/category-fixture'
import { Category } from '@core/category/domain/category.entity'

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp()

  describe('/categories/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Category Not Found using ID: 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a'
          }
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid is expected)'
          }
        }
      ]

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected)
      })
    })

    it('should return a category ', async () => {
      const categoryRepo = nestApp.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
      )

      const category = Category.fake().aCategory().build()

      await categoryRepo.insert(category)

      const res = await request(nestApp.app.getHttpServer())
        .get(`/categories/${category.category_id.id}`)
        .expect(200)

      const keyInResponse = GetCategoryFixture.keysInResponse

      expect(Object.keys(res.body)).toStrictEqual(['data'])
      expect(Object.keys(res.body.data)).toEqual(
        expect.arrayContaining(keyInResponse)
      )

      const presenter = CategoriesController.serialize(
        CategoryOutputMapper.toOutput(category)
      )

      const serialized = instanceToPlain(presenter)

      expect(res.body.data).toStrictEqual(serialized)
    })
  })
})
