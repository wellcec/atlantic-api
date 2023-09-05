import { DataSource } from 'typeorm'
import { env } from 'process'
import Users from '../schemas/User'
import Categories from '../schemas/Category'
import logger from '../logger/logger'
import Variations from '../schemas/Variation'
import Image from '../schemas/Image'
import Product from '../schemas/Product'

export default class MongoConnection {
  private dataSource: DataSource

  constructor() {
    this.dataSource = new DataSource({
      type: 'mongodb',
      host: env.MONGODB_URL,
      database: 'bookmagic',
      entities: [Users, Categories, Variations, Image, Product],
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
