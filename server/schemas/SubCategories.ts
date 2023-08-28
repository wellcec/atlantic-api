import { Column, ObjectIdColumn, ObjectId } from 'typeorm'

class SubCategories {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default SubCategories