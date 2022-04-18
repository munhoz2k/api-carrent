import { NextFunction, Request, Response } from "express";
import { verify, JsonWebTokenError } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "6b25cff77f9bad60a73fa81daa7d06ae"
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AppError("User does not exists!", 401);
    }

    throw new AppError(error.message, 500);
  }
}
