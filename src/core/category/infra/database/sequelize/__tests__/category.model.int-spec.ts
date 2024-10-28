import { DataType } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  test("mapping props", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "created_at",
      "is_active",
    ]);

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      type: DataType.UUID(),
      primaryKey: true,
      fieldName: "category_id",
      field: "category_id",
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      allowNull: false,
      type: DataType.STRING(255),
      Model: CategoryModel,
      fieldName: "name",
      field: "name",
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      allowNull: true,
      type: DataType.TEXT(),
      Model: CategoryModel,
      fieldName: "description",
      field: "description",
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      allowNull: false,
      type: DataType.BOOLEAN(),
      Model: CategoryModel,
      fieldName: "is_active",
      field: "is_active",
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      allowNull: false,
      type: DataType.DATE(3),
      Model: CategoryModel,
      fieldName: "created_at",
      field: "created_at",
    });
  });

  test("should create a category", async () => {
    // arrange
    const arrange = {
      category_id: "f13fbefb-174c-4ca8-8c00-1c64d08f25cd",
      name: "test",
      is_active: true,
      created_at: new Date(),
    };

    // act
    const category = await CategoryModel.create(arrange);

    // assert
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
