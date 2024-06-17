import User from '../schemas/User'

type GetAllUsersResponse = {
  data: User[]
  page: number
  pageSize: number
  count: number
}

type CreateUserRequest = {
  name: string
  document: string
}

export {
  GetAllUsersResponse,
  CreateUserRequest
}