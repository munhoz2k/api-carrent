import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

export class CreateCategoryController {
  async handle(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      const createCategoryUseCase = container.resolve(CreateCategoryUseCase);
      await createCategoryUseCase.execute({ name, description });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
