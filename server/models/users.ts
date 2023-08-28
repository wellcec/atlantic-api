import User from '../schemas/Users'

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