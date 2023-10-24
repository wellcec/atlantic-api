import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm'
import SubCategory from './SubCategory'
import { Exclude } from 'class-transformer'

@Entity('categories')
class Category {
  @ObjectIdColumn()
  _id?: ObjectId

  @Column({ default: "" })
  name: string

  @Column({ default: [] })
  subCategories: SubCategory[]

  @Column()
  createdDate: Date

  @Column()
  updatedDate: Date
}

export default Category