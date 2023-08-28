import Variations from '../schemas/Variations'

type GetAllVariationsResponse = {
  data: Variations[]
  page: number
  pageSize: number
  count: number
}

type CreateVariationRequest = {
  name: string
}

export {
  GetAllVariationsResponse,
  CreateVariationRequest
}