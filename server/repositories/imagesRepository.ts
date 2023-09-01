import { MongoRepository } from 'typeorm'
import { BaseMongo } from '../config/BaseMongo'
import Image from '../schemas/Image'
import { ObjectId } from 'mongodb'

export class ImagesRepository extends BaseMongo {
  private imagesRepository: Promise<MongoRepository<any>>

  constructor() {
    super()
    this.imagesRepository = super.getMongoRepository(Image)
  }

  public async getAll() {
    const repo = await this.imagesRepository
    const data: Image[] = await repo.find()
    return {
      data
    }
  }

  public async insert(image: Image) {
    const repo = await this.imagesRepository
    const imageToInsert: Image = repo.create(image)
    return await repo.save(imageToInsert)
  }

  public async getById(id: string) {
    const repo = await this.imagesRepository
    return await repo.findOneBy({
      _id: new ObjectId(id),
    });
  }

  public async deleteOne(id: string) {
    const repo = await this.imagesRepository
    return await repo.deleteOne({
      _id: new ObjectId(id),
    })
  }

  public async delete() {
    const repo = await this.imagesRepository
    return await repo.clear()
  }
}