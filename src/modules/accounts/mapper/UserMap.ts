import { instanceToInstance } from "class-transformer";

import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { IUserResponseDTO } from "../dtos/IUserResponseDTO";

export class UserMap {
  static toDTO({
    email,
    name,
    id,
    avatar,
    driver_license,
    avatar_url,
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      email,
      name,
      id,
      avatar,
      driver_license,
      avatar_url,
    });
    return user;
  }
}
