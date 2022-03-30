import { Request, Response } from "express";

import { ImportCategoryUseCase } from "./ImportCategoryUseCase";

export class ImportCategoryController {
  constructor(private importCategoryUseCase: ImportCategoryUseCase) {}

  handle(req: Request, res: Response): Response {
    const { file } = req;
    try {
      this.importCategoryUseCase.execute(file);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
