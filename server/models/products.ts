import Product from "../schemas/Product"
import Image from "../schemas/Image"

type StatusProductType = {
  isActive?: boolean,
  isHighlighted?: boolean,
  isLaunch?: boolean,
  isSale?: boolean,
  isBestSeller?: boolean,
  isPreOrder?: boolean,
}

type ReturnFeedbackType = {
  message?: string
  code?: number
  image?: Image
}

type ShippingType = "free" | "correios"

type CreateProductRequest = Omit<Product, "createdDate" | "updatedDate">

type UpdateProductRequest = Omit<Product, "createdDate">

type ProductsList = Pick<Product, "_id" | "title" | "subtitle" | "images" | "status" | "value" | "valueUnique">

type ProductsByCategoryList = Pick<Product, "_id" | "title">

type UpdateStatusRequest = Pick<Product, "status">

type GetAllProductsResponse = {
  data: ProductsList[]
  page: number
  pageSize: number
  count: number
}

export {
  StatusProductType,
  ReturnFeedbackType,
  ShippingType,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsList,
  ProductsByCategoryList,
  UpdateStatusRequest,
  GetAllProductsResponse,
}