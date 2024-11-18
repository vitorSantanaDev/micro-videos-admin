import { Entity } from '../../../../domain/entity'
import { NotFoundError } from '../../../../domain/errors/not-found.error'
import { Uuid } from '../../../../domain/value-objects/uuid.vo'
import { InMemoryRepository } from '../in-memory.repository'

type StubEntityContructorProps = {
  entity_id?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entity_id: Uuid
  name: string
  price: number

  constructor(props: StubEntityContructorProps) {
    super()
    this.entity_id = props.entity_id ?? new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON() {
    return {
      entity_id: this.entity_id,
      name: this.name,
      price: this.price
    }
  }
}

class StubMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubMemoryRepository

  beforeEach(() => {
    repository = new StubMemoryRepository()
  })

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 10
    })

    await repository.insert(entity)

    expect(repository.items.length).toBe(1)
    expect(repository.items[0]).toBe(entity)
  })

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        name: 'Entity 1',
        price: 10
      }),
      new StubEntity({
        name: 'Entity 2',
        price: 20
      })
    ]

    await repository.bulkInsert(entities)

    expect(repository.items.length).toBe(2)
    expect(repository.items[0]).toEqual(entities[0])
    expect(repository.items[1]).toEqual(entities[1])
  })

  test('should return all entities', async () => {
    const entities = [
      new StubEntity({
        name: 'Entity 1',
        price: 10
      }),
      new StubEntity({
        name: 'Entity 2',
        price: 20
      })
    ]

    await repository.bulkInsert(entities)

    const items = await repository.findAll()

    expect(items).toEqual(entities)
  })

  test('should update an entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 10
    })

    await repository.insert(entity)

    entity.price = 20

    await repository.update(entity)

    expect(repository.items[0].price).toBe(20)
  })

  test('should delete an entity', async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 10
    })

    await repository.insert(entity)

    await repository.delete(entity.entity_id)
    expect(repository.items.length).toBe(0)
  })

  test("should throw an error when trying to delete an entity that doesn't exist", async () => {
    const entity_id = new Uuid()

    await expect(repository.delete(entity_id)).rejects.toThrow(
      new NotFoundError(entity_id, StubEntity)
    )
  })
  test("should throw an error when trying to update an entity that doesn't exist", async () => {
    const entity = new StubEntity({
      name: 'Test',
      price: 10
    })

    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    )
  })
})
