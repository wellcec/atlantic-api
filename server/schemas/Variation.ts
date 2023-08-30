import { Column, ObjectIdColumn, ObjectId, Entity } from 'typeorm'

@Entity('variations')
class Variation {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default Variation