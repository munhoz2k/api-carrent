import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}

  async execute(old_refresh_token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(
      old_refresh_token,
      auth.secretRefresh
    ) as IPayload;

    const user_id = sub;

    const userToken = await this.usersTokensRepository.findUserAndToken(
      user_id,
      old_refresh_token
    );

    if (!userToken) {
      throw new AppError("Refresh Token does not exists!", 404);
    }

    const tokenExpired = this.dayjsDateProvider.compareIfExpired(
      this.dayjsDateProvider.dateNow(),
      userToken.expires_date
    );

    if (tokenExpired) {
      throw new AppError("Token is expired", 400);
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const newToken = sign({}, auth.secret, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    });

    const refresh_token = sign({ email }, auth.secretRefresh, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token,
    });

    const expires_date = this.dayjsDateProvider.addDays(
      auth.refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    return {
      token: newToken,
      refresh_token,
    };
  }
}
