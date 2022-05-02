import { Rental } from "../infra/typeorm/entities/Rental";

export interface IRentalsRepository {
  findOpenRentalByUser(user_id: string): Promise<Rental>;
  findOpenRentalByCar(car_id: string): Promise<Rental>;
}
