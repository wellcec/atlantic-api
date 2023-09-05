import Product from "../schemas/Product"

export type StatusProductType = {
  isActive?: boolean,
  isHighlighted?: boolean,
  isLaunch?: boolean,
  isSale?: boolean,
  isBestSeller?: boolean,
  isPreOrder?: boolean,
}

export type CreateProductRequest = Omit<Product, "id" | "_id" | "createdDate" | "updatedDate">

export type ProductsList = Pick<Product, "id" | "title" | "subtitle" | 'images' | 'status'>

export type UpdateStatusRequest = Pick<Product, 'status'>