import { Request, Response } from "express";

import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

export class CreateSpecificationController {
  constructor(private createSpecificationUseCase: CreateSpecificationUseCase) {}

  handle(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      this.createSpecificationUseCase.execute({ name, description });

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
