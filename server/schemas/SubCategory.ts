import { Column } from 'typeorm'

class SubCategory {
  @Column({ default: "" })
  id: string

  @Column({ default: "" })
  name: string

  @Column()
  createdDate: Date
}

export default SubCategory