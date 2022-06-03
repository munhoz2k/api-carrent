import { Request, Response } from "express";
import { container } from "tsyringe";

import { UserProfileUseCase } from "./UserProfileUseCase";

export class UserProfileController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const userProfileUseCase = container.resolve(UserProfileUseCase);

    const user = await userProfileUseCase.execute(user_id);

    return res.json(user);
  }
}
