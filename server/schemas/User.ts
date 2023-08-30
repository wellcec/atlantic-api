import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm'

@Entity('users')
class User {
  @ObjectIdColumn()
  id: ObjectId

  @Column({ default: "" })
  name: string

  @Column({ default: "" })
  document: string

  @Column()
  createdDate: Date
}

export default User