import { Category } from "../../../../domain/category.entity";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { CategoryModel } from "../../../../infra/database/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/database/sequelize/category.sequelize.repository";

describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    await useCase.execute({
      id: category.category_id.id,
    });

    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });
});
