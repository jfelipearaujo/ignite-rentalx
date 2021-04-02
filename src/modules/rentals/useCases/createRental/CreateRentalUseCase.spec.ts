import dayjs from "dayjs";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayJsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let carsRepository: ICarsRepository;
let rentalsRepository: IRentalsRepository;
let dateProvider: IDateProvider;

let createRentalUseCase: CreateRentalUseCase;

describe("Create Rental", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    rentalsRepository = new RentalsRepositoryInMemory();
    dateProvider = new DayJsDateProvider();

    createRentalUseCase = new CreateRentalUseCase(
      carsRepository,
      rentalsRepository,
      dateProvider
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

    const expected_return_date = dayjs().add(1, "day").toDate();

    // Act
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date,
    });

    // Assert
    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental with a non existing car", async () => {
    // Arrange
    const expectedError = new AppError(
      "Car not found",
      HttpStatusCode.BAD_REQUEST
    );

    const expected_return_date = dayjs().add(1, "day").toDate();

    // Act
    const errorFunction = async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "id_thats_not_exists",
        expected_return_date,
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

  it("should not be able to create a new rental with the same car", async () => {
    // Arrange
    const expectedError = new AppError(
      "Car already in use",
      HttpStatusCode.BAD_REQUEST
    );

    const car = await carsRepository.create({
      name: "Car name",
      description: "Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    // Act
    const errorFunction = async () => {
      const expected_return_date = dayjs().add(1, "day").toDate();

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date,
      });

      await createRentalUseCase.execute({
        user_id: "67890",
        car_id: car.id,
        expected_return_date,
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

  it("should not be able to create a new rental with the same user", async () => {
    // Arrange
    const expectedError = new AppError(
      "User already with an open rental",
      HttpStatusCode.BAD_REQUEST
    );

    const car1 = await carsRepository.create({
      name: "Car name 1",
      description: "Description 1",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    const car2 = await carsRepository.create({
      name: "Car name 2",
      description: "Description 2",
      daily_rate: 100,
      license_plate: "ABC-5678",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    // Act
    const errorFunction = async () => {
      const expected_return_date = dayjs().add(1, "day").toDate();

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car1.id,
        expected_return_date,
      });
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car2.id,
        expected_return_date,
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

  it("should not be able to create a new rental with invalid return time", async () => {
    // Arrange
    const expectedError = new AppError(
      "The rental must have a minimum duration of 24 hours",
      HttpStatusCode.BAD_REQUEST
    );

    const car = await carsRepository.create({
      name: "Car name",
      description: "Description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Car Brand",
      category_id: "category_id",
    });

    const expected_return_date = dayjs().add(1, "hour").toDate();

    // Act
    const errorFunction = async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date,
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
});
