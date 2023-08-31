import { ImagesRepository } from '../repositories/imagesRepository'
import Image from '../schemas/Image'

export class ProductsController {
  private imagesRepository: ImagesRepository

  constructor() {
    this.imagesRepository = new ImagesRepository()
  }

  public async getAllImages() {
    return await this.imagesRepository.getAll()
  }

  public async insertImages(image: Image) {
    return await this.imagesRepository.insert(image)
  }
}