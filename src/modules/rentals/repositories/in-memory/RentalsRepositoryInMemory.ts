import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentalsRepository: Rental[] = [];

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const rental = this.rentalsRepository.find(
      (rental) => rental.user_id === user_id && rental.end_date === null
    );

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const rental = this.rentalsRepository.find(
      (rental) => rental.car_id === car_id && rental.end_date === null
    );

    return rental;
  }
}

export { RentalsRepositoryInMemory };
