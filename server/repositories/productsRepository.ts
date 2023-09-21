import { MongoRepository } from 'typeorm'
import { BaseMongo } from '../config/BaseMongo'
import Product from '../schemas/Product'
import { ObjectId } from 'mongodb'
import { ProductsList, UpdateProductRequest } from '../models/products'

export class ProductsRepository extends BaseMongo {
  private productsRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.productsRepository = super.getMongoRepository(Product)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.productsRepository

    const skip = (page - 1) * pageSize

    let all: ProductsList[] = []
    let count: number = 0

    if (term) {
      const regex_like = { $regex: new RegExp(term, 'i') }
      const condition = {
        where: {
          $or: [
            { title: regex_like },
            { subtitle: regex_like },
            { value: regex_like },
          ],
        },
      }

      all = await repo.find({
        skip,
        take: pageSize,
        order: { name: 'ASC' },
        ...condition,
      })

      count = await repo.count(condition.where)
    } else {
      count = await repo.count()
      all = await repo.find({ skip, take: pageSize })
    }

    return {
      data: all,
      page,
      pageSize,
      count
    }
  }

  public async insert(product: Product): Promise<Product> {
    const repo = await this.productsRepository
    const productToInsert: Product = repo.create(product)
    return await repo.save(productToInsert)
  }

  public async update(id: string, product: Product | UpdateProductRequest) {
    const repo = await this.productsRepository
    return await repo.update({
      id: { $eq: id }
    }, product)
  }

  public async getById(id: string): Promise<Product> {
    const repo = await this.productsRepository
    return await repo.findOneBy({ id });
  }

  public async getByCategoryId(id: string): Promise<Product[]> {
    const repo = await this.productsRepository

    return await repo.find({
      where: {
        $or: [
          { 'categories.id': id },
        ],
      }
    });
  }

  public async deleteOne(id: string) {
    const repo = await this.productsRepository
    return await repo.deleteOne({ id })
  }
}