import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
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
    private rentalsRepository: IRentalsRepository
  ) {
    // UseCase
  }

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<void> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError("Car not found", HttpStatusCode.NOT_FOUND);
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
  }
}

export { CreateRentalUseCase };
