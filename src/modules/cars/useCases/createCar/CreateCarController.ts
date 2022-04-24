import { Request, Response } from "express";
import { container } from "tsyringe";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";

import { CreateCarUseCase } from "./CreateCarUseCase";

export class CreateCarController {
  async handle(req: Request, res: Response) {
    const {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    }: ICreateCarDTO = req.body;

    const createCarUseCase = container.resolve(CreateCarUseCase);

    await createCarUseCase.execute({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    return res.status(201).send();
  }
}
