import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepository: ICarsRepository;
let specificationsRepository: ISpecificationsRepository;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car-Specification", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    specificationsRepository = new SpecificationsRepositoryInMemory();

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepository,
      specificationsRepository
    );
  });

  it("should be able to associate a specification to a non existing car", async () => {
    // Arrange
    const expectedError = new AppError(
      "Car not found",
      HttpStatusCode.NOT_FOUND
    );

    const car_id = "1234";
    const specifications_id = ["4321"];

    // Act
    const errorFunction = async () => {
      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
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

  it("should be able to associate a specification to a car", async () => {
    // Arrange
    const car = await carsRepository.create({
      name: "Car name",
      description: "Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category",
    });

    const specification = await specificationsRepository.create({
      name: "Specification Name",
      description: "Specification Description",
    });

    // Act
    const carSpecification = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id: [specification.id],
    });

    // Assert
    expect(car.specifications).toEqual([specification]);
    expect(car).toMatchObject(carSpecification);
  });
});
