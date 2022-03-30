import { Request, Response } from "express";

import { ListCategoriesUseCase } from "./ListCategoriesuseCase";

export class ListCategoriesController {
  constructor(private listCategoriesUseCase: ListCategoriesUseCase) {}

  handle(req: Request, res: Response): Response {
    try {
      const categories = this.listCategoriesUseCase.execute();

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
