import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {
    // UseCase
  }

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const MINIMUM_HOURS_TO_RETURN = 24;

    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError("Car not found", HttpStatusCode.BAD_REQUEST);
    }

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(
      car_id
    );

    if (carUnavailable) {
      throw new AppError("Car already in use", HttpStatusCode.BAD_REQUEST);
    }

    const userWithRental = await this.rentalsRepository.findOpenRentalByUserId(
      user_id
    );

    if (userWithRental) {
      throw new AppError(
        "User already with an open rental",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    );

    if (compare < MINIMUM_HOURS_TO_RETURN) {
      throw new AppError(
        "The rental must have a minimum duration of 24 hours",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
