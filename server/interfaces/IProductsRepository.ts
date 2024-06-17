import { ObjectId } from "mongodb"
import Product from "../schemas/Product"
import { GetAllProductsResponse, UpdateProductRequest } from "../models/products"
import { DeleteResult } from "typeorm"

export default interface IProductsRepository {
  getAll(term: string, page: number, pageSize: number): Promise<GetAllProductsResponse | undefined>
  insert(product: Product): Promise<Product>
  update(id: ObjectId, product: Product | UpdateProductRequest)
  getById(id: ObjectId): Promise<Product>
  getByCategoryId(id: ObjectId): Promise<Product[]>
  delete(id: ObjectId): Promise<DeleteResult>
}
