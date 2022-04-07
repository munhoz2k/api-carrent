import { CategoriesRepository } from "../../repositories/implementations/CategoryRepository";
import { ListCategoriesController } from "./ListCategoriesController";
import { ListCategoriesUseCase } from "./ListCategoriesuseCase";

const categoriesRepository = null;

const listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository);

const listCategoriesController = new ListCategoriesController(
  listCategoriesUseCase
);

export {
  categoriesRepository,
  listCategoriesUseCase,
  listCategoriesController,
};
