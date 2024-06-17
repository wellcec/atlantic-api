import { ObjectId } from "mongodb"
import { DeleteResult, UpdateResult } from "typeorm"
import { GetAllUsersResponse } from "../models/users"
import User from "../schemas/User"

export default interface IUsersRepository {
  getAll(term: string, page: number, pageSize: number): Promise<GetAllUsersResponse | undefined>
  insert(user: User): Promise<any>
  update(id: ObjectId, objToUpdate: User): Promise<UpdateResult>
  delete(id: ObjectId): Promise<DeleteResult>
}
