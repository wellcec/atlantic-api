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

  public async getImageById(id: string) {
    return await this.imagesRepository.getById(id)
  }

  public async insertImages(image: Image) {
    return await this.imagesRepository.insert(image)
  }

  public async deleteImage(id: string) {
    return await this.imagesRepository.deleteOne(id)
  }
}