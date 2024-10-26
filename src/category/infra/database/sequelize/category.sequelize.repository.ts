import { CategoryModel } from "./category.model";
import { Category } from "../../../domain/category.entity";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { ISearchableRespository } from "../../../../shared/domain/repository/repository.interface";
import {
  CategorySearchParams,
  CategorySearchResult,
} from "../../../domain/category.repository";
import { Op } from "sequelize";
import { CategoryModelMapper } from "./category-model-mapper";

export class CategorySequelizeRepository
  implements ISearchableRespository<Category, Uuid>
{
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(model.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON()
    );
    await this.categoryModel.bulkCreate(models);
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const id = entity_id.id;

    const model = await this._get(id);

    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;

    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelToUpdate = CategoryModelMapper.toModel(entity);

    await this.categoryModel.update(modelToUpdate.toJSON(), {
      where: { category_id: id },
    });
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;

    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const deleteCount = await this.categoryModel.destroy({
      where: { category_id: id },
    });

    if (deleteCount === 0) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: { name: { [Op.like]: `%${props.filter}%` } },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }
}
