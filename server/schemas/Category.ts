import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm'
import SubCategory from './SubCategory'

@Entity('categories')
class Category {
  @ObjectIdColumn()
  _id?: ObjectId

  @Column({ default: "" })
  id: string

  @Column({ default: "" })
  name: string

  @Column({ default: [] })
  subCategories: SubCategory[]

  @Column()
  createdDate: Date
}

export default Category