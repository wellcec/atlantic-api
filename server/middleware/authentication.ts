
import { Response, NextFunction } from 'express'
import logger from '../logger/logger'

export const validateAccessToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.query.accesstoken) {
      logger.warn(`Missing access token`)
      return res.status(401).json({ message: 'Missing access token' })
    }
    next()
  }
  catch (error) {
    logger.error("Unable to perfom authentication.", error)
    return res.status(401).send({ message: 'Authentication failure.' })
  }
}
