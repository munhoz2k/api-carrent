import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCategoriesUseCase } from "./ListCategoriesuseCase";

export class ListCategoriesController {
  async handle(req: Request, res: Response) {
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);
    const categories = await listCategoriesUseCase.execute();

    return res.status(200).json(categories);
  }
}
