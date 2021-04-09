import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

interface IRequest {
  rental_id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {
    // UseCase
  }

  async execute({ rental_id, user_id }: IRequest): Promise<Rental> {
    const MINIMUM_DAYS_TO_RENT = 1;

    const rental = await this.rentalsRepository.findById(rental_id);

    if (!rental) {
      throw new AppError("Rental not found", HttpStatusCode.NOT_FOUND);
    }

    if (rental.end_date) {
      throw new AppError("Rent already finalized", HttpStatusCode.BAD_REQUEST);
    }

    const car = await this.carsRepository.findById(rental.car_id);

    const dateNow = this.dateProvider.dateNow();

    let rentedDays = this.dateProvider.compareInDays(
      rental.start_date,
      dateNow
    );

    if (rentedDays <= 0) {
      rentedDays = MINIMUM_DAYS_TO_RENT;
    }

    let totalRent = 0;

    if (this.dateProvider.isAfter(dateNow, rental.expected_return_date)) {
      let dalayedDays = this.dateProvider.compareInDays(
        dateNow,
        rental.expected_return_date
      );

      if (dalayedDays < 0) dalayedDays *= -1;

      if (dalayedDays > 0) {
        const fineAmount = dalayedDays * car.fine_amount;

        totalRent = fineAmount;
      }
    }

    totalRent += rentedDays * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = totalRent;

    await this.rentalsRepository.create(rental);

    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
