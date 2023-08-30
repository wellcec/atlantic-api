require('dotenv').config({ path: __dirname + '/.env' })
import 'reflect-metadata'
import express = require('express')
import cors = require('cors')

import logger from './logger/logger'
import { router } from './routes'
import codes from './constants/codes'
import MongoConnection from './config/MongoConnection'

const app = express()

app.use(cors({
  origin: '*',
  preflightContinue: true,
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Accept-Encoding", "Connection", "Host", "Authorization", "Access-Control-Allow-Origin"],
}))

app.options('/*', (_, res) => { res.sendStatus(codes.Success) })
app.use(express.json())
app.use('/', router)

async function start() {
  await new MongoConnection().startMongoConnection()

  app.listen(process.env.PORT, () => {
    logger.info(`Magic running on port ${process.env.PORT}...`)
  })
}

start()