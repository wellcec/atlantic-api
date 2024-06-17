import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'mongodb'

import User from '../schemas/User'
import { GetAllUsersResponse } from '../models/users'
import IUsersRepository from '../interfaces/IUsersRepository'

@injectable()
export class UsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }

  public getAll = async (term: string, page: number, pageSize: number): Promise<GetAllUsersResponse | undefined> => {
    return await this.usersRepository.getAll(term, page, pageSize)
  }

  public insert = async (user: User): Promise<User> => {
    return await this.usersRepository.insert(user)
  }

  public update = async (id: ObjectId, user: User) => {
    return await this.usersRepository.update(id, user)
  }

  public delete = async (id: ObjectId) => {
    return await this.usersRepository.delete(id)
  }
}