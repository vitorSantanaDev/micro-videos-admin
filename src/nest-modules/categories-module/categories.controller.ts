import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Controller,
  ParseUUIDPipe
} from '@nestjs/common'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case'
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update-category/update-category.use-case'
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case'
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case'
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-category/list-categories.use-case'
import { CreateCategoryDto } from './dto/create-category.dto'
import { CategoryPresenter } from './categories.presenter'
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output'

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase

  @Inject(UpdateCategoryUseCase)
  private updateCategoryUseCase: UpdateCategoryUseCase

  @Inject(DeleteCategoryUseCase)
  private deleteCategoryUseCase: DeleteCategoryUseCase

  @Inject(GetCategoryUseCase)
  private getCategoryUseCase: GetCategoryUseCase

  @Inject(ListCategoriesUseCase)
  private listCategoryUseCase: ListCategoriesUseCase

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute(createCategoryDto)
    return CategoriesController.serialize(output)
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const output = await this.updateCategoryUseCase.execute({
      ...updateCategoryDto,
      id
    })
    return CategoriesController.serialize(output)
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output)
  }
}
