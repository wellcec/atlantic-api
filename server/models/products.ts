import Product from "../schemas/Product"

export type StatusProductType = {
  isActive?: boolean,
  isHighlighted?: boolean,
  isLaunch?: boolean,
  isSale?: boolean,
  isBestSeller?: boolean,
  isPreOrder?: boolean,
}

export type ShippingType = "free" | "correios"

export type CreateProductRequest = Omit<Product, "createdDate" | "updatedDate">

export type UpdateProductRequest = Omit<Product, "createdDate">

export type ProductsList = Pick<Product, "_id" | "title" | "subtitle" | "images" | "status" | "value" | "valueUnique">

export type ProductsByCategoryList = Pick<Product, "_id" | "title">

export type UpdateStatusRequest = Pick<Product, "status">