import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

export class CreateCarSpecificationController {
  async handle(req: Request, res: Response) {
    const { car_id } = req.params;
    const { specifications_id } = req.body;

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase
    );

    const cars = await createCarSpecificationUseCase.execute({
      car_id,
      specifications_id,
    });

    return res.status(201).json(cars);
  }
}
