import logger from '../logger/logger'
import MongoConnection from '../config/MongoConnection'
import { EntityTarget, ObjectLiteral } from 'typeorm'

export abstract class BaseMongo {
  async getMongoRepository(entity: EntityTarget<ObjectLiteral>) {
    try {
      const db = await new MongoConnection().getDataSourceMongo()

      let repo = db.getMongoRepository(entity)
      return repo
    }
    catch (error) {
      logger.error(error)
    }
  }
}