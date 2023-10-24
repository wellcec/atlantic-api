import { Column, ObjectId } from 'typeorm'

class SubCategory {
  @Column({ default: "" })
  _id?: ObjectId

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default SubCategory