import { CategoryOutput } from '@core/category/application/use-cases/common/category-output'
import { Transform } from 'class-transformer'

export class CategoryPresenter {
  id: string
  name: string
  description: string | null
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date

  constructor(output: CategoryOutput) {
    this.id = output.id
    this.name = output.name
    this.description = output.description
    this.created_at = output.created_at
  }
}
