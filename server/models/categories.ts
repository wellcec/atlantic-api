import Categories from '../schemas/Categories'
import SubCategories from '../schemas/SubCategories'

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