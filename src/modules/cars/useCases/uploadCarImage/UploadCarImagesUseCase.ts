import { inject, injectable } from "tsyringe";

import { ICarImagesRepository } from "@modules/cars/repositories/ICarImagesRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";
import { HttpStatusCode } from "@shared/errors/HttpStatusCode";
import { deleteFile } from "@utils/file";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("CarImagesRepository")
    private carImagesRepository: ICarImagesRepository
  ) {
    // UseCase
  }

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError("Car not found", HttpStatusCode.NOT_FOUND);
    }

    images_name.map(async (image_name) => {
      await this.carImagesRepository.create(car_id, image_name);
    });

    images_name.map(async (image_name) => {
      await deleteFile(`./tmp/car_images/${image_name}`);
    });
  }
}

export { UploadCarImagesUseCase };
