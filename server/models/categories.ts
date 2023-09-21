import Category from '../schemas/Category'
import SubCategory from '../schemas/SubCategory'

type GetAllCategoriesResponse = {
  data: Category[]
  page: number
  pageSize: number
  count: number
}

type CreateCategoriesRequest = {
  name: string
  subCategories: SubCategory[]
}

export {
  GetAllCategoriesResponse,
  CreateCategoriesRequest
}