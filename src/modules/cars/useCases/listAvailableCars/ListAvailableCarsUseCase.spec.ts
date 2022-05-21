import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all avaible cars", async () => {
    const car1 = {
      name: "car1",
      description: "car desc 1 ",
      daily_rate: 90.0,
      license_plate: "ABC-1234",
      fine_amount: 100,
      brand: "brand1",
      category_id: "945ac7cc-9277-48ba-b2ec-3b08157c14d4",
    };

    const car2 = {
      name: "car2",
      description: "car desc 2",
      daily_rate: 100.0,
      license_plate: "DEF-5678",
      fine_amount: 100,
      brand: "brand2",
      category_id: "945ac7cc-9277-48ba-b2ec-3b08157c14d4",
    };

    await carsRepositoryInMemory.create(car1);
    await carsRepositoryInMemory.create(car2);

    let cars = await listAvailableCarsUseCase.execute({});

    cars = cars.map((car) => {
      // eslint-disable-next-line no-param-reassign
      delete car.id;
      // eslint-disable-next-line no-param-reassign
      delete car.available;

      return car;
    });

    expect(cars).toEqual([car1, car2]);
  });

  it("should be able to list all avaible cars by brand", async () => {
    const car3 = {
      name: "car3",
      description: "car desc 3",
      daily_rate: 100.0,
      license_plate: "GHI-9101",
      fine_amount: 100,
      brand: "brand3",
      category_id: "945ac7cc-9277-48ba-b2ec-3b08157c14d4",
    };

    await carsRepositoryInMemory.create(car3);

    let cars = await listAvailableCarsUseCase.execute({ brand: car3.brand });

    cars = cars.map((car) => {
      // eslint-disable-next-line no-param-reassign
      delete car.id;
      // eslint-disable-next-line no-param-reassign
      delete car.available;

      return car;
    });

    expect(cars).toEqual([car3]);
  });

  it("should be able to list all avaible cars by name", async () => {
    const car3 = {
      name: "car3",
      description: "car desc 3",
      daily_rate: 100.0,
      license_plate: "GHI-9101",
      fine_amount: 100,
      brand: "brand3",
      category_id: "945ac7cc-9277-48ba-b2ec-3b08157c14d4",
    };

    await carsRepositoryInMemory.create(car3);

    let cars = await listAvailableCarsUseCase.execute({ name: car3.name });

    cars = cars.map((car) => {
      // eslint-disable-next-line no-param-reassign
      delete car.id;
      // eslint-disable-next-line no-param-reassign
      delete car.available;

      return car;
    });

    expect(cars).toEqual([car3]);
  });

  it("should be able to list all avaible cars by category id", async () => {
    const car3 = {
      name: "car3",
      description: "car desc 3",
      daily_rate: 100.0,
      license_plate: "GHI-9101",
      fine_amount: 100,
      brand: "brand3",
      category_id: "945ac7cc-9277-48ba-b2ec-3b08157c14d4",
    };

    await carsRepositoryInMemory.create(car3);

    let cars = await listAvailableCarsUseCase.execute({
      category_id: car3.category_id,
    });

    cars = cars.map((car) => {
      // eslint-disable-next-line no-param-reassign
      delete car.id;
      // eslint-disable-next-line no-param-reassign
      delete car.available;

      return car;
    });

    expect(cars).toEqual([car3]);
  });
});
