import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

export class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<void> {
    const carAvailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (!carAvailable) {
      throw new AppError("Car is not available for use!", 400);
    }

    const userOpenRental = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (userOpenRental) {
      throw new AppError("There's a open rental in this user account!");
    }
  }
}
