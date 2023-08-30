import { MongoRepository } from 'typeorm'
import { BaseMongo } from '../config/BaseMongo'
import Image from '../schemas/Image'

export class ImagesRepository extends BaseMongo {
  private imagesRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.imagesRepository = super.getMongoRepository(Image)
  }

  public async getAll() {
    const repo = await this.imagesRepository
    return await repo.find()
  }

  public async insert(image: Image) {
    const repo = await this.imagesRepository
    const imageToInsert: Image = repo.create(image)
    return await repo.save(imageToInsert)
  }

  public async delete() {
    const repo = await this.imagesRepository
    return await repo.clear()
  }
}