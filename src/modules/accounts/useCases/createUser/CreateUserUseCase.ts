import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {
    // UseCase
  }

  async execute({
    name,
    password,
    email,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const userEmailAlreadyExists = await this.usersRepository.findByEmail(
      email
    );

    if (userEmailAlreadyExists) {
      throw new Error("User e-mail already exists");
    }

    const passwordHash = await hash(password, 8);

    await this.usersRepository.create({
      name,
      password: passwordHash,
      email,
      driver_license,
    });
  }
}

export { CreateUserUseCase };
