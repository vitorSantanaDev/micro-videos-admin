import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      name: entity.name,
      is_active: entity.is_active,
      created_at: entity.created_at,
      description: entity.description,
      category_id: entity.category_id.id,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const entity = new Category({
      name: model.name,
      is_active: model.is_active,
      description: model.description,
      created_at: model.created_at,
      category_id: new Uuid(model.category_id),
    });

    Category.validate(entity);

    return entity;
  }
}
