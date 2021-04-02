import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentalsRepository: Rental[] = [];

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const rental = this.rentalsRepository.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const rental = this.rentalsRepository.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );

    return rental;
  }

  async create({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      user_id,
      car_id,
      expected_return_date,
      start_date: new Date(),
    });

    this.rentalsRepository.push(rental);

    return rental;
  }
}

export { RentalsRepositoryInMemory };
