import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'mongodb'

import Product from '../schemas/Product'
import IProductsRepository from '../interfaces/IProductsRepository'
import { GetAllProductsResponse, UpdateProductRequest } from '../models/products'

@injectable()
export class ProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository
  ) { }

  public getAll = async (term: string, page: number, pageSize: number): Promise<GetAllProductsResponse | undefined> => {
    return await this.productsRepository.getAll(term, page, pageSize)
  }

  public insert = async (product: Product): Promise<Product> => {
    return await this.productsRepository.insert(product)
  }

  public getById = async (id: ObjectId): Promise<Product> => {
    return await this.productsRepository.getById(id)
  }

  public getByCategoryId = async (id: ObjectId): Promise<Product[]> => {
    return await this.productsRepository.getByCategoryId(id)
  }

  public update = async (id: ObjectId, product: Product | UpdateProductRequest) => {
    return await this.productsRepository.update(id, product)
  }

  public delete = async (id: ObjectId) => {
    return await this.productsRepository.delete(id)
  }
}