import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvide";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const createCar = {
      name: "Test",
      description: "Car test",
      daily_rate: 100,
      license_plate: "test-1234",
      fine_amount: 60,
      category_id: "1234",
      brand: "Volvo T4",
    };

    await carsRepositoryInMemory.create(createCar);
    const car = await carsRepositoryInMemory.findByPlate(
      createCar.license_plate
    );

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the user", async () => {
    const createCar = {
      name: "Test",
      description: "Car test",
      daily_rate: 100,
      license_plate: "test-1234",
      fine_amount: 60,
      category_id: "1234",
      brand: "Volvo T4",
    };

    const createCar1 = {
      name: "Test 1",
      description: "Car test 1",
      daily_rate: 100,
      license_plate: "4321-test",
      fine_amount: 60,
      category_id: "1234",
      brand: "Volvo T4",
    };

    await carsRepositoryInMemory.create(createCar);
    await carsRepositoryInMemory.create(createCar1);

    const car = await carsRepositoryInMemory.findByPlate(
      createCar.license_plate
    );

    const car1 = await carsRepositoryInMemory.findByPlate(
      createCar1.license_plate
    );

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: car1.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(
      new AppError("There's a open rental in this user account!")
    );
  });

  it("should not be able to create a new rental if there is another open rental to the same car", async () => {
    const createCar = {
      name: "Test",
      description: "Car test",
      daily_rate: 100,
      license_plate: "test-12345",
      fine_amount: 60,
      category_id: "1234",
      brand: "Volvo T4",
    };

    await carsRepositoryInMemory.create(createCar);
    const car = await carsRepositoryInMemory.findByPlate(
      createCar.license_plate
    );

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "54321",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is not available for use!"));
  });
});
