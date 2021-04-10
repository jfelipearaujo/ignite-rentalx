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
    id,
    user_id,
    car_id,
    expected_return_date,
    total,
    end_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      id,
      user_id,
      car_id,
      expected_return_date,
      start_date: new Date(),
      total,
      end_date,
    });

    this.rentalsRepository.push(rental);

    return rental;
  }

  async findById(rental_id: string): Promise<Rental> {
    const rental = this.rentalsRepository.find(
      (rental) => rental.id === rental_id
    );

    return rental;
  }

  async findByUserId(user_id: string): Promise<Rental[]> {
    const rentals = this.rentalsRepository.filter(
      (rental) => rental.user_id === user_id
    );

    return rentals;
  }
}

export { RentalsRepositoryInMemory };
