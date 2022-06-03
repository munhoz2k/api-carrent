import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(refresh_token: string, password: string): Promise<void> {
    const userToken = await this.usersTokensRepository.findByToken(
      refresh_token
    );

    if (!userToken) {
      throw new AppError("Invalid token!");
    }

    const dateExpired = this.dateProvider.compareIfExpired(
      this.dateProvider.dateNow(),
      userToken.expires_date
    );

    if (dateExpired) {
      throw new AppError("Token expired!");
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 10);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}
