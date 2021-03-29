import { AppError } from "../../../../errors/AppError";
import { HttpStatusCode } from "../../../../errors/HttpStatusCode";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepository: ICategoriesRepository;

describe("Create Category", () => {
  beforeAll(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();

    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository);
  });

  it("Should be able to create a new category", async () => {
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

  it("Should not be able to create a new category with a already used name", async () => {
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
