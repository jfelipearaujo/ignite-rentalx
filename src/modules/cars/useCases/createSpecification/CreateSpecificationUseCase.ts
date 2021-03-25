import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { HttpStatusCode } from "../../../../errors/HttpStatusCode";
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject("SpecificationsRepository")
    private specificationRepository: ISpecificationsRepository
  ) {
    // UseCase
  }

  async execute({ name, description }: IRequest): Promise<void> {
    const specificationAlreadyExists = await this.specificationRepository.findByName(
      name
    );

    if (specificationAlreadyExists) {
      throw new AppError(
        "Specification already exists",
        HttpStatusCode.BAD_REQUEST
      );
    }

    await this.specificationRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };
