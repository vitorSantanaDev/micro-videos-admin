import { EntityValidationError } from '../../../../shared/domain/validators/validation.error'
import { Category, CategoryId } from '../../../domain/category.aggregate'
import { CategoryModel } from './category.model'

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      name: entity.name,
      is_active: entity.is_active,
      created_at: entity.created_at,
      description: entity.description,
      category_id: entity.category_id.id
    })
  }

  static toEntity(model: CategoryModel): Category {
    const category = new Category({
      category_id: new CategoryId(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at
    })

    category.validate()

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON())
    }
    return category
  }
}
