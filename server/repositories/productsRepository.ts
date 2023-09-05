import { MongoRepository } from 'typeorm'
import { BaseMongo } from '../config/BaseMongo'
import Product from '../schemas/Product'
import { ObjectId } from 'mongodb'
import { ProductsList } from '../models/products'

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

  public async insert(image: Product): Promise<Product> {
    const repo = await this.productsRepository
    const productToInsert: Product = repo.create(image)
    return await repo.save(productToInsert)
  }

  public async getById(id: string): Promise<Product> {
    const repo = await this.productsRepository
    return await repo.findOneBy({
      _id: new ObjectId(id),
    });
  }

  public async deleteOne(id: string) {
    const repo = await this.productsRepository
    return await repo.deleteOne({
      _id: new ObjectId(id),
    })
  }
}