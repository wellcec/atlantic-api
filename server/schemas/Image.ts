import { Column, ObjectIdColumn, ObjectId, Entity } from 'typeorm'

@Entity('images')
class Image {
  @ObjectIdColumn()
  _id: ObjectId

  @Column({ default: "" })
  id: string

  @Column({ default: "" })
  fileName: string

  @Column({ default: "" })
  base64: string

  @Column()
  createdDate: Date
}

export default Image