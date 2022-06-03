import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

export interface IUsersTokensRepository {
  create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken>;

  findUserAndToken(user_id: string, refresh_token: string): Promise<UserToken>;

  deleteById(id: string): Promise<void>;

  findByToken(refresh_token: string): Promise<UserToken>;
}
