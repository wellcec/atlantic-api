import { DeleteResult, MongoRepository, UpdateResult } from 'typeorm'
import { ObjectId } from 'mongodb'

import Category from '../schemas/Category'
import { BaseMongo } from '../config/BaseMongo'
import ICategoriesRepository from '../interfaces/ICategoriesRepository'

export class CategoriesRepository extends BaseMongo implements ICategoriesRepository {
  private categoriesRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.categoriesRepository = super.getMongoRepository(Category)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.categoriesRepository

    const skip = (page - 1) * pageSize

    let all: Category[] = []
    let count: number = 0

    if (term) {
      const regex_like = { $regex: new RegExp(term, 'i') }
      const condition = {
        where: {
          $or: [
            { name: regex_like },
            { 'subCategories.name': regex_like },
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

  public async insert(category: Category) {
    const repo = await this.categoriesRepository
    const categoryToInsert: Category = repo.create(category)
    const result: Category = await repo.save(categoryToInsert)

    return result
  }

  public async getById(id: ObjectId): Promise<Category> {
    const repo = await this.categoriesRepository
    return await repo.findOneBy({
      _id: id,
    });
  }

  public async update(id: ObjectId, objToUpdate: Category): Promise<UpdateResult> {
    const repo = await this.categoriesRepository
    const result = await repo.update(id, objToUpdate)

    return result
  }

  public async delete(id: ObjectId): Promise<DeleteResult> {
    const repo = await this.categoriesRepository
    const result = await repo.delete(id)

    return result
  }
}