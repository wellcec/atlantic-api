import Variations from '../schemas/Variation'

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