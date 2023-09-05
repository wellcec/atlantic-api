import Product from "../schemas/Product"

export type StatusProductType = {
  isLaunch: boolean,
  isSale: boolean,
  isBestSeller: boolean,
  isPreOrder: boolean,
}

export type CreateProductRequest = Omit<Product, "id" | "_id" | "createdDate" | "updatedDate">

export type ProductsList = Pick<Product, "title" | "subtitle" | 'images' | 'status'>