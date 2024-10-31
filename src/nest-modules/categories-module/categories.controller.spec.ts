import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesModule } from './categories.module'
import { CategoriesController } from './categories.controller'
import { ConfigModule } from '../config-module/config.module'
import { DatabaseModule } from '../database-module/database.module'

describe('CategoriesController', () => {
  let controller: CategoriesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule]
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
