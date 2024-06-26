import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'

import Variation from '../schemas/Variation'
import { BaseMongo } from '../config/BaseMongo'
import IVariationsRepository from '../interfaces/IVariationsRepository'

export class VariationsRepository extends BaseMongo implements IVariationsRepository {
  private variationsRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.variationsRepository = super.getMongoRepository(Variation)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.variationsRepository

    const skip = (page - 1) * pageSize

    let all: Variation[] = []
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

  public async insert(variation: Variation) {
    const repo = await this.variationsRepository
    const variationToInsert: Variation = repo.create(variation)
    const result = await repo.save(variationToInsert)

    return result
  }

  public async delete(id: ObjectId) {
    const repo = await this.variationsRepository
    const result = await repo.delete(id)

    return result
  }
}