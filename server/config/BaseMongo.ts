import logger from '../logger/logger'
import MongoConnection from '../config/MongoConnection'

export abstract class BaseMongo {
  async getMongoRepository(entity: any) {
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