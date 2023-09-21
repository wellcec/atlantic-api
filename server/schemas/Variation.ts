import { Column, ObjectIdColumn, ObjectId, Entity } from 'typeorm'

@Entity('variations')
class Variation {
  @ObjectIdColumn()
  _id: ObjectId

  @Column({ default: "" })
  id: string

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default Variation