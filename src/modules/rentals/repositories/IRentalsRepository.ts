import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { ICreateRentalDTO } from "../dtos/ICreateRentalDTO";

interface IRentalsRepository {
  findByUserId(user_id: string): Promise<Rental[]>;
  findById(rental_id: string): Promise<Rental>;
  create(data: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByUserId(user_id: string): Promise<Rental>;
  findOpenRentalByCarId(car_id: string): Promise<Rental>;
}

export { IRentalsRepository };
