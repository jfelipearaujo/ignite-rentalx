import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token not found", HttpStatusCode.UNAUTHORIZED);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "93dfcaf3d923ec47edb8580667473987"
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const userExists = await usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists", HttpStatusCode.UNAUTHORIZED);
    }

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new AppError("Invalid token", HttpStatusCode.UNAUTHORIZED);
  }
}
