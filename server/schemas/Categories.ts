import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm'
import SubCategories from './SubCategories'

@Entity('categories')
class Categories {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  name: string

  @Column({ default: [] })
  subCategories: SubCategories[]

  @Column()
  createdDate: Date
}

export default Categories