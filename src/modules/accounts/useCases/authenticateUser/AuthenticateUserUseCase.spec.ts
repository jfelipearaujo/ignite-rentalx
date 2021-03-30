import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();

    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    // Arrange
    const user: ICreateUserDTO = {
      name: "user name",
      email: "user@email.com",
      password: "123456",
      driver_license: "123456789",
    };

    await createUserUseCase.execute(user);

    // Act
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    // Assert
    expect(result).not.toBeNull();
    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate when user does not exists", async () => {
    // Arrange
    const expectedError = new AppError(
      "E-mail or password incorrect",
      HttpStatusCode.UNAUTHORIZED
    );

    // Act
    const authFunction = async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "123456",
      });
    };

    // Assert
    expect(authFunction).rejects.toBeInstanceOf(AppError);
    expect(authFunction).rejects.toHaveProperty(
      "message",
      expectedError.message
    );
    expect(authFunction).rejects.toHaveProperty(
      "statusCode",
      expectedError.statusCode
    );
  });

  it("should not be able to authenticate an user when the password is incorrect", async () => {
    // Arrange
    const expectedError = new AppError(
      "E-mail or password incorrect",
      HttpStatusCode.UNAUTHORIZED
    );

    const user: ICreateUserDTO = {
      name: "user name",
      email: "user@email.com",
      password: "123456",
      driver_license: "123456789",
    };

    await createUserUseCase.execute(user);

    // Act
    const authFunction = async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect_password",
      });
    };

    // Assert
    expect(authFunction).rejects.toBeInstanceOf(AppError);
    expect(authFunction).rejects.toHaveProperty(
      "message",
      expectedError.message
    );
    expect(authFunction).rejects.toHaveProperty(
      "statusCode",
      expectedError.statusCode
    );
  });
});
