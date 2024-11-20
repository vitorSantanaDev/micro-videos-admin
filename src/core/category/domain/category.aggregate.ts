import { AggregateRoot } from '@core/shared/domain/aggregate-root'
import { ValueObject } from '../../shared/domain/value-objects'
import { Uuid } from '../../shared/domain/value-objects/uuid.vo'
import { CategoryFakeBuilder } from './category-fake.builder'
import { CategoryValidatorFactory } from './category.validator'

export type CategoryConstructorProps = {
  category_id?: CategoryId
  name: string
  description?: string | null
  is_active?: boolean
  created_at?: Date
}

export type CategoryCreateCommand = {
  name: string
  description?: string | null
  is_active?: boolean
}

export class CategoryId extends Uuid {}

export class Category extends AggregateRoot {
  category_id: CategoryId
  name: string
  description: string | null
  is_active: boolean
  created_at: Date

  constructor(props: CategoryConstructorProps) {
    super()
    this.category_id = props.category_id ?? new CategoryId()
    this.name = props.name
    this.description = props.description ?? null
    this.is_active = props.is_active ?? true
    this.created_at = props.created_at ?? new Date()
  }

  get entity_id(): ValueObject {
    return this.category_id
  }

  static create(props: CategoryCreateCommand): Category {
    const category = new Category(props)

    category.validate(['name'])

    return category
  }

  changeName(name: string): void {
    this.name = name
    this.validate(['name'])
  }

  changeDescription(description: string): void {
    this.description = description
  }

  activate() {
    this.is_active = true
  }

  deactivate() {
    this.is_active = false
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create()
    return validator.validate(this.notification, this, fields)
  }

  static fake() {
    return CategoryFakeBuilder
  }

  toJSON() {
    return {
      name: this.name,
      is_active: this.is_active,
      created_at: this.created_at,
      category_id: this.category_id,
      description: this.description
    }
  }
}
