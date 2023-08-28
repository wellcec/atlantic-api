import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { BaseMongo } from '../config/BaseMongo'
import Users from '../schemas/Users'

export class UsersRepository extends BaseMongo {
  private usersRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.usersRepository = super.getMongoRepository(Users)
  }

  public async getAll(term: string, page: number, pageSize: number) {
    const repo = await this.usersRepository

    const skip = (page - 1) * pageSize

    let all: Users[] = []
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

  public async insert(user: Users) {
    const repo = await this.usersRepository
    const userToInsert: Users = repo.create(user)
    const result = await repo.save(userToInsert)

    return result
  }

  public async update(id: string, objToUpdate: Users) {
    const repo = await this.usersRepository
    const result = await repo.update(id, objToUpdate)

    return result
  }

  public async delete(id: string) {
    const repo = await this.usersRepository
    const result = await repo.deleteOne({
      _id: new ObjectId(id),
    })

    return result
  }
}