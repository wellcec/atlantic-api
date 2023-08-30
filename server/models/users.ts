import User from '../schemas/User'

type GetAllUsersRespnse = {
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
  GetAllUsersRespnse,
  CreateUserRequest
}