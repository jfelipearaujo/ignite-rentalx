import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

interface IRentalsRepository {
  findOpenRentalByUserId(user_id: string): Promise<Rental>;
  findOpenRentalByCarId(car_id: string): Promise<Rental>;
}

export { IRentalsRepository };
