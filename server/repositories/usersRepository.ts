import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { BaseMongo } from '../config/BaseMongo'
import User from '../schemas/User'

export class UsersRepository extends BaseMongo {
  private usersRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.usersRepository = super.getMongoRepository(User)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.usersRepository

    const skip = (page - 1) * pageSize

    let all: User[] = []
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

  public async insert(user: User) {
    const repo = await this.usersRepository
    const userToInsert: User = repo.create(user)
    const result = await repo.save(userToInsert)

    return result
  }

  public async update(id: ObjectId, objToUpdate: User) {
    const repo = await this.usersRepository
    const result = await repo.update(id, objToUpdate)

    return result
  }

  public async delete(id: ObjectId) {
    const repo = await this.usersRepository
    const result = await repo.delete(id)

    return result
  }
}