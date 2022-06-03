import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;

  refreshToken: string;

  user: {
    name: string;
    email: string;
  };
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!", 400);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!", 400);
    }

    const token = sign({}, auth.secret, {
      subject: user.id,
      expiresIn: auth.expires_in_token,
    });

    const refreshToken = sign({ email }, auth.secretRefresh, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const refreshTokenExpiresDate = this.dayjsDateProvider.addDays(
      auth.refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_date: refreshTokenExpiresDate,
    });

    const tokenReturn: IResponse = {
      token,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }
}
