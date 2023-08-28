import { DataSource } from 'typeorm'
import { env } from 'process'
import Users from '../schemas/Users'
import Categories from '../schemas/Categories'
import logger from '../logger/logger'
import Variations from '../schemas/Variations'

export default class MongoConnection {
  private dataSource: DataSource

  constructor() {
    this.dataSource = new DataSource({
      type: 'mongodb',
      host: env.MONGODB_URL,
      database: 'bookmagic',
      entities: [Users, Categories, Variations],
      useUnifiedTopology: true,
      synchronize: true,
      logging: false,
      useNewUrlParser: true
    })
  }

  public async startMongoConnection() {
    console.info('[MongoConnection] connection request started')

    try {
      await this.dataSource.initialize()
      logger.info('[MongoConnection] connection established ')
    } catch (err) {
      logger.error('[MongoConnection] connection failed with', err)
      process.exit(1)
    }
  }

  public async getDataSourceMongo() {
    await this.dataSource.initialize()
    return this.dataSource
  }
}
