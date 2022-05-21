import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const carAvailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    console.log(carAvailable);

    if (carAvailable) {
      throw new AppError("Car is not available for use!", 400);
    }

    const userOpenRental = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (userOpenRental) {
      throw new AppError("There's a open rental in this user account!", 400);
    }

    const dateNow = this.dateProvider.dateNow();

    const compareDates = this.dateProvider.compareInHours(
      expected_return_date,
      dateNow
    );

    if (compareDates < 24) {
      throw new AppError(
        "Rental return date should be at least 1 day longer",
        400
      );
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailable(car_id, false);

    return rental;
  }
}
