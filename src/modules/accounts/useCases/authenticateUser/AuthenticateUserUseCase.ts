import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@errors/AppError";
import { HttpStatusCode } from "@errors/HttpStatusCode";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {
    // UseCase
  }

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        "E-mail or password incorrect",
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        "E-mail or password incorrect",
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const token = sign({}, "93dfcaf3d923ec47edb8580667473987", {
      subject: user.id,
      expiresIn: "1d",
    });

    const tokenData: IResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };

    return tokenData;
  }
}

export { AuthenticateUserUseCase };
