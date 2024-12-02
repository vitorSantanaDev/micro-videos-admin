import { CategoryModel } from './category.model'
import { Category, CategoryId } from '../../../domain/category.aggregate'

import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import { ISearchableRespository } from '../../../../shared/domain/repository/repository.interface'
import {
  CategorySearchParams,
  CategorySearchResult
} from '../../../domain/category.repository'
import { literal, Op } from 'sequelize'
import { CategoryModelMapper } from './category-model-mapper'
import { SortDirection } from '@core/shared/domain/repository/search-params'
import { InvalidArgumentError } from '@core/shared/domain/errors/invalid-argument.error'

export class CategorySequelizeRepository
  implements ISearchableRespository<Category, CategoryId>
{
  sortableFields: string[] = ['name', 'created_at']
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`) //ascii
    }
  }

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity)
    await this.categoryModel.create(model.toJSON())
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON()
    )
    await this.categoryModel.bulkCreate(models)
  }

  async findById(entity_id: CategoryId): Promise<Category | null> {
    const id = entity_id.id

    const model = await this._get(id)

    return model ? CategoryModelMapper.toEntity(model) : null
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll()

    return models.map((model) => CategoryModelMapper.toEntity(model))
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id

    const model = await this._get(id)

    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }

    const modelToUpdate = CategoryModelMapper.toModel(entity)

    await this.categoryModel.update(modelToUpdate.toJSON(), {
      where: { category_id: id }
    })
  }

  async delete(entity_id: CategoryId): Promise<void> {
    const id = entity_id.id

    const model = await this._get(id)

    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }

    const deleteCount = await this.categoryModel.destroy({
      where: { category_id: id }
    })

    if (deleteCount === 0) {
      throw new NotFoundError(id, this.getEntity())
    }
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: { name: { [Op.like]: `%${props.filter}%` } }
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir!) }
        : { order: [['created_at', 'desc']] }),
      offset,
      limit
    })

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      total: count,
      current_page: props.page,
      per_page: props.per_page
    })
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  async existsById(
    ids: CategoryId[]
  ): Promise<{ exists: CategoryId[]; not_exists: CategoryId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element'
      )
    }

    const existsCategoryModels = await this.categoryModel.findAll({
      attributes: ['category_id'],
      where: {
        category_id: {
          [Op.in]: ids.map((id) => id.id)
        }
      }
    })
    const existsCategoryIds = existsCategoryModels.map(
      (m) => new CategoryId(m.category_id)
    )
    const notExistsCategoryIds = ids.filter(
      (id) => !existsCategoryIds.some((e) => e.equals(id))
    )
    return {
      exists: existsCategoryIds,
      not_exists: notExistsCategoryIds
    }
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.categoryModel.sequelize!.getDialect() as 'mysql'

    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir)
    }

    return [[sort, sort_dir]]
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id)
  }
}
