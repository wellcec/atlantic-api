import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { BaseMongo } from '../config/BaseMongo'
import Variations from '../schemas/Variations'

export class VariationsRepository extends BaseMongo {
  private variationsRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.variationsRepository = super.getMongoRepository(Variations)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.variationsRepository

    const skip = (page - 1) * pageSize

    let all: Variations[] = []
    let count: number = 0

    if (term) {
      const regex_like = { $regex: new RegExp(term, 'i') }
      const condition = {
        where: {
          $or: [
            { name: regex_like },
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

  public async insert(variation: Variations) {
    const repo = await this.variationsRepository
    const variationToInsert: Variations = repo.create(variation)
    const result = await repo.save(variationToInsert)

    return result
  }

  public async delete(id: string) {
    const repo = await this.variationsRepository
    const result = await repo.deleteOne({
      _id: new ObjectId(id),
    })

    return result
  }
}