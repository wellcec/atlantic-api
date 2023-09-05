import { ImagesRepository } from '../repositories/imagesRepository'
import { ProductsRepository } from '../repositories/productsRepository'
import Image from '../schemas/Image'
import Product from '../schemas/Product'

export class ProductsController {
  private imagesRepository: ImagesRepository
  private productsRepository: ProductsRepository

  constructor() {
    this.imagesRepository = new ImagesRepository()
    this.productsRepository = new ProductsRepository()
  }

  public async getAllProducts(term: string, page: number, pageSize: number) {
    return await this.productsRepository.getAll(term, page, pageSize)
  }

  public async getProductById(id: string) {
    return await this.productsRepository.getById(id)
  }

  public async getAllImages() {
    return await this.imagesRepository.getAll()
  }

  public async getImageById(id: string) {
    return await this.imagesRepository.getById(id)
  }

  public async insertProduct(product: Product) {
    return await this.productsRepository.insert(product)
  }

  public async updateProduct(id: string, product: Product) {
    return await this.productsRepository.update(id, product)
  }

  public async deleteProduct(id: string) {
    return await this.productsRepository.deleteOne(id)
  }

  public async insertImages(image: Image) {
    return await this.imagesRepository.insert(image)
  }

  public async deleteImage(id: string) {
    return await this.imagesRepository.deleteOne(id)
  }

  public async deleteTempImages() {
    return await this.imagesRepository.delete()
  }
}