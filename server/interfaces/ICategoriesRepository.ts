import { DeleteResult, UpdateResult } from "typeorm"
import { GetAllCategoriesResponse } from "../models/categories"
import Category from "../schemas/Category"
import { ObjectId } from "mongodb"

export default interface ICategoriesRepository {
  getAll(term: string, page: number, pageSize: number): Promise<GetAllCategoriesResponse | undefined>
  insert(category: Category): Promise<Category>
  getById(id: ObjectId): Promise<Category>
  update(id: ObjectId, objToUpdate: Category): Promise<UpdateResult>
  delete(id: ObjectId): Promise<DeleteResult>
}
