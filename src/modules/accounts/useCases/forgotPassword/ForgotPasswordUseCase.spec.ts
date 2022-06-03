import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvide";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { ForgotPasswordUseCase } from "./ForgotPasswordUseCase";

let dayjsDateProvider: IDateProvider;
let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let mailProvider: IMailProvider;
let forgotPasswordUseCase: ForgotPasswordUseCase;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    forgotPasswordUseCase = new ForgotPasswordUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dayjsDateProvider,
      mailProvider
    );
  });

  it("should be able to send a reset password link to the user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      name: "Blanche Curry",
      email: "lucasmunhoz@gmail.com",
      driver_license: "664168",
      password: "blanchecurry",
    });

    await forgotPasswordUseCase.execute("lucasmunhoz@gmail.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send a reset password link to an unexistent user", async () => {
    await expect(
      forgotPasswordUseCase.execute("lucasmunhoz@gmail.com")
    ).rejects.toEqual(new AppError("Users does not exists!", 404));
  });

  it("should be able to create a token for the password reset", async () => {
    const generateToken = jest.spyOn(usersTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      name: "Leon Perkins",
      email: "leaonperkins@gmail.com",
      driver_license: "787330",
      password: "leonperkins",
    });

    await forgotPasswordUseCase.execute("leaonperkins@gmail.com");

    expect(generateToken).toBeCalled();
  });
});
