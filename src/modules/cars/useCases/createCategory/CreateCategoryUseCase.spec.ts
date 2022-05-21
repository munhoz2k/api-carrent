import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "@modules/cars/useCases/createCategory/CreateCategoryUseCase";
import { AppError } from "@shared/errors/AppError";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("should be able to create a new category", async () => {
    const categoName = "Category Testing";
    const categoDescription = "Category description Test";

    await createCategoryUseCase.execute({
      name: categoName,
      description: categoDescription,
    });

    const categoryCreated = await categoriesRepositoryInMemory.findByName(
      categoName
    );

    expect(categoryCreated.name).toBe(categoName);
    expect(categoryCreated.description).toBe(categoDescription);
  });

  it("should not be able to create a new category with same name", async () => {
    const categoName = "Category Testing";
    const categoDescription = "Category description Test";

    await createCategoryUseCase.execute({
      name: categoName,
      description: categoDescription,
    });

    await expect(
      createCategoryUseCase.execute({
        name: categoName,
        description: categoDescription,
      })
    ).rejects.toEqual(new AppError("Category already exists!"));
  });
});
