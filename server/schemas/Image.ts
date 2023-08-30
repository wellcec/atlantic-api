import { Column, ObjectIdColumn, ObjectId, Entity } from 'typeorm'

@Entity('images')
class Image {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  fileName: string

  @Column()
  createdDate: Date
}

export default Image