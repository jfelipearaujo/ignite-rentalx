import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepository: ICarsRepository;
let listCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();

    listCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("should be able to list all available cars", async () => {
    // Arrange
    const car = await carsRepository.create({
      name: "Car Name 1",
      description: "Car Description 1",
      daily_rate: 100,
      license_plate: "ABC-2345",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    // Act
    const cars = await listCarsUseCase.execute({});

    // Assert
    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    // Arrange
    const car = await carsRepository.create({
      name: "Car Name 1",
      description: "Car Description 1",
      daily_rate: 100,
      license_plate: "ABC-2345",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    // Act
    const cars = await listCarsUseCase.execute({
      name: "Car Name 1",
    });

    // Assert
    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    // Arrange
    const car = await carsRepository.create({
      name: "Car Name 1",
      description: "Car Description 1",
      daily_rate: 100,
      license_plate: "ABC-2345",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    // Act
    const cars = await listCarsUseCase.execute({
      brand: "Car Brand",
    });

    // Assert
    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    // Arrange
    const car = await carsRepository.create({
      name: "Car Name 1",
      description: "Car Description 1",
      daily_rate: 100,
      license_plate: "ABC-2345",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    // Act
    const cars = await listCarsUseCase.execute({
      category_id: "category_id",
    });

    // Assert
    expect(cars).toEqual([car]);
  });
});
