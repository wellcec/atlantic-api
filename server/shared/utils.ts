import { ObjectId } from "mongodb";

export const genId = (id?: string | ObjectId) => {
  return id ? new ObjectId(id) : new ObjectId()
}

export const removeId = (item: any) => {
  const { _id, ...rest } = item
  return rest
}