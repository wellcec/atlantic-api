import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { BaseMongo } from '../config/BaseMongo'
import Categories from '../schemas/Categories'

export class CategoriesRepository extends BaseMongo {
  private categoriesRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.categoriesRepository = super.getMongoRepository(Categories)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.categoriesRepository

    const skip = (page - 1) * pageSize

    let all: Categories[] = []
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

  public async insert(category: Categories) {
    const repo = await this.categoriesRepository
    const categoryToInsert: Categories = repo.create(category)
    const result = await repo.save(categoryToInsert)

    return result
  }

  public async update(id: string, objToUpdate: Categories) {
    const repo = await this.categoriesRepository
    const result = await repo.update(id, objToUpdate)

    return result
  }

  public async delete(id: string) {
    const repo = await this.categoriesRepository
    const result = await repo.deleteOne({
      _id: new ObjectId(id),
    })

    return result
  }
}