import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

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
    const carRegistered = await createCarUseCaser.execute(car);

    // Assert
    expect(carRegistered).toHaveProperty("id");
  });

  it("should not be able to create a car with a license plate already in use", async () => {
    // Arrange
    const expectedError = new AppError(
      "Car (license plate) already exists",
      HttpStatusCode.BAD_REQUEST
    );

    const errorFunction = async () => {
      const car1 = {
        name: "Car name 1",
        description: "Description 1",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Car Brand",
        category_id: "category",
      };

      const car2 = {
        name: "Car name 2",
        description: "Description 2",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Car Brand",
        category_id: "category",
      };

      // Act
      await createCarUseCaser.execute(car1);
      await createCarUseCaser.execute(car2);
    };

    // Assert
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

  it("should be able to create a new car with available property defined by true", async () => {
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
    const carRegistered = await createCarUseCaser.execute(car);

    // Assert
    expect(carRegistered.available).toBeTruthy();
  });
});
