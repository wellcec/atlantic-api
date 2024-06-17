import { DeleteResult as DeleteResultORM } from "typeorm"
import { ObjectId, DeleteResult } from "mongodb"
import Image from '../schemas/Image'

export default interface IImagesRepository {
  getAll(): Promise<{ data: Image[] }>
  getById(id: ObjectId): Promise<any>
  deleteOne(id: ObjectId): Promise<DeleteResultORM>
  delete(): Promise<DeleteResult>
  insert(image: Image): Promise<Image>
}
