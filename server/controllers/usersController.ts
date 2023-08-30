import { GetAllUsersRespnse } from '../models/users'
import { UsersRepository } from '../repositories/usersRepository'
import User from '../schemas/User'

export class UsersController {
  private usersRepository

  constructor() {
    this.usersRepository = new UsersRepository()
  }

  public async getAllUsers(term: string, page: number, pageSize: number): Promise<GetAllUsersRespnse> {
    return await this.usersRepository.getAll(term, page, pageSize)
  }

  public async insertUser(user: User) {
    return await this.usersRepository.insert(user)
  }

  public async updateUser(id: string, user: User) {
    return await this.usersRepository.update(id, user)
  }

  public async deleteUser(id: string) {
    return await this.usersRepository.delete(id)
  }
}