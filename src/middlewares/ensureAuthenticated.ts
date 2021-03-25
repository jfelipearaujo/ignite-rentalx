import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

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
    throw new Error("Token not found");
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
      throw new Error("User does not exists");
    }

    next();
  } catch {
    throw new Error("Invalid token");
  }
}
