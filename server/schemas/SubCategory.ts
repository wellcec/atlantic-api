import { Column, ObjectIdColumn, ObjectId } from 'typeorm'

class SubCategory {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default SubCategory