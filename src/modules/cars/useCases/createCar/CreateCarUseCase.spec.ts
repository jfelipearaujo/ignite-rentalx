import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { CreateCarUseCase } from "./CreateCarUseCase";

let carsRepository: ICarsRepository;
let createCarUseCaser: CreateCarUseCase;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();

    createCarUseCaser = new CreateCarUseCase(carsRepository);
  });

  it("should be able to create a new car", async () => {
    // Arrange
    const car = {
      name: "Car name",
      description: "Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category",
    };

    // Act
    await createCarUseCaser.execute(car);

    // Assert
  });
});
