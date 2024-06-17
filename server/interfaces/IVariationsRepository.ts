import { ObjectId } from "mongodb"
import { DeleteResult } from "typeorm"
import Variation from "../schemas/Variation"
import { GetAllVariationsResponse } from "../models/variations"

export default interface IVariationsRepository {
  getAll(term: string, page: number, pageSize: number): Promise<GetAllVariationsResponse | undefined>
  insert(variation: Variation): Promise<any>
  delete(id: ObjectId): Promise<DeleteResult>
}
