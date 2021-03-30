import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepository: ICategoriesRepository;
let createCategoryUseCase: CreateCategoryUseCase;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();

    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository);
  });

  it("should be able to create a new category", async () => {
    const category = {
      name: "Category Test",
      description: "Category Test Description",
    };

    await createCategoryUseCase.execute(category);

    const result = await categoriesRepository.findByName(category.name);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("id");

    const { name, description } = result;

    expect(name).toBe(category.name);
    expect(description).toBe(category.description);
  });

  it("should not be able to create a new category with a already used name", async () => {
    const expectedError = new AppError(
      "Category already exists",
      HttpStatusCode.BAD_REQUEST
    );

    const errorFunction = async () => {
      const category = {
        name: "Category Test",
        description: "Category Test Description",
      };

      await createCategoryUseCase.execute(category);

      await createCategoryUseCase.execute(category);
    };

    expect(errorFunction).rejects.toBeInstanceOf(AppError);
    expect(errorFunction).rejects.toHaveProperty(
      "message",
      expectedError.message
    );
    expect(errorFunction).rejects.toHaveProperty(
      "statusCode",
      expectedError.statusCode
    );
  });
});
