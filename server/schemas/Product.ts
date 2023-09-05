import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm'
import Category from './Category'
import Variation from './Variation'
import Image from './Image'
import { StatusProductType } from '../models/products'

const defaultStatus = {
  isActive: false,
  isHighlighted: false,
  isLaunch: false,
  isSale: false,
  isBestSeller: false,
  isPreOrder: false
}

@Entity('products')
class Product {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  title: string

  @Column({ default: "" })
  subtitle: string

  @Column({ default: 0 })
  value: number

  @Column({ default: 0 })
  valueUnique: number

  @Column({ default: 0 })
  weight: string

  @Column({ default: 0 })
  height: string

  @Column({ default: 0 })
  length: string

  @Column({ default: "" })
  width: string

  @Column({ default: [] })
  categories: Category[]

  @Column({ default: [] })
  images: Image[]

  @Column({ default: [] })
  variations: Variation[]

  @Column({ default: [] })
  tags: string[]

  @Column({ default: defaultStatus })
  status: StatusProductType

  @Column()
  createdDate: Date

  @Column()
  updatedDate: Date
}

export default Product