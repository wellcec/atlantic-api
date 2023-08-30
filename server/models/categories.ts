import Categories from '../schemas/Category'
import SubCategories from '../schemas/SubCategory'

type GetAllCategoriesResponse = {
  data: Categories[]
  page: number
  pageSize: number
  count: number
}

type CreateCategoriesRequest = {
  name: string
  subCategories: SubCategories[]
}

export {
  GetAllCategoriesResponse,
  CreateCategoriesRequest
}