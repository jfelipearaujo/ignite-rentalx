import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let carsRepository: ICarsRepository;
let rentalsRepository: IRentalsRepository;
let createRentalUseCase: CreateRentalUseCase;

describe("Create Rental", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    rentalsRepository = new RentalsRepositoryInMemory();

    createRentalUseCase = new CreateRentalUseCase(
      carsRepository,
      rentalsRepository
    );
  });

  it("should be able to create a new rental", async () => {
    // Arrange
    const car = await carsRepository.create({
      name: "Car name",
      description: "Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    const rental = {
      user_id: "12345",
      car_id: car.id,
      expected_return_date: new Date(),
    };

    // Act
    await createRentalUseCase.execute(rental);

    // Assert
  });
});
