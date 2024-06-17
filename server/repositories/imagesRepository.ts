import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'

import Image from '../schemas/Image'
import { BaseMongo } from '../config/BaseMongo'
import IImagesRepository from '../interfaces/IImagesRepository'

export class ImagesRepository extends BaseMongo implements IImagesRepository {
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
    const result: Image = await repo.save(imageToInsert)
    return result
  }

  public async getById(id: ObjectId) {
    const repo = await this.imagesRepository
    return await repo.findOneBy({
      _id: new ObjectId(id),
    });
  }

  public async deleteOne(id: ObjectId) {
    const repo = await this.imagesRepository
    return await repo.delete(id)
  }

  public async delete() {
    const repo = await this.imagesRepository
    return await repo.deleteMany({
      fileName: { $ne: '' }
    })
  }
}