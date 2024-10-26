import { CategoryModel } from "../category.model";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Category } from "../../../../domain/category.entity";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      category_id: "f13fbefb-174c-4ca8-8c00-1c64d08f25cd",
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail("The catgory is valid, but it needs throws a EntityValidationError");
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category aggregate", () => {
    const created_at = new Date();

    const model = CategoryModel.build({
      category_id: "f13fbefb-174c-4ca8-8c00-1c64d08f25cd",
      name: "some value",
      description: "some description",
      created_at,
      is_active: true,
    });

    const aggregate = CategoryModelMapper.toEntity(model);

    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("f13fbefb-174c-4ca8-8c00-1c64d08f25cd"),
        name: "some value",
        description: "some description",
        is_active: true,
        created_at,
      }).toJSON()
    );
  });

  it("should convert a category aggregate to a category model", () => {
    const created_at = new Date();
    const entity = new Category({
      category_id: new Uuid("f13fbefb-174c-4ca8-8c00-1c64d08f25cd"),
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const model = CategoryModelMapper.toModel(entity);
    expect(model.toJSON()).toStrictEqual({
      category_id: "f13fbefb-174c-4ca8-8c00-1c64d08f25cd",
      name: "some value",
      description: "some description",
      created_at,
      is_active: true,
    });
  });
});
