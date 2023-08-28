import { Column, ObjectIdColumn, ObjectId, Entity } from 'typeorm'

@Entity('variations')
class Variations {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default Variations