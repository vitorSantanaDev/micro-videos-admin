import { Category, CategoryId } from '../../../domain/category.aggregate'
import { SortDirection } from '../../../../shared/domain/repository/search-params'
import { InMemorySearchableRepository } from '../../../../shared/infra/database/in-memory/in-memory.repository'
import {
  CategoryFilter,
  ICategoryRepository
} from '../../../domain/category.repository'

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, CategoryId>
  implements ICategoryRepository
{
  sortableFields: string[] = ['name', 'created_at']

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter
  ): Promise<Category[]> {
    if (!filter) {
      return items
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc')
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }
}
