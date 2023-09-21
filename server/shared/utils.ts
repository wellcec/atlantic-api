import { ObjectId } from "mongodb";

export const genId = (id?: string) => {
  return id ? new ObjectId(id).toString() : new ObjectId().toString()
}
