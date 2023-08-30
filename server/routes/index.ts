import { Router } from 'express'
import { validateAccessToken } from '../middleware/authentication'
import usersRoute from './usersRoute'
import categoriesRoute from './categoriesRoute'
import variationsRoute from './variationsRoute'
import productsRoute from './productsRoute'
const router = Router()

router.get('/api/healthcheck', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  try {
    res.send(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.status(503).send()
  }
})

router.use('/api/users', usersRoute)
router.use('/api/categories', categoriesRoute)
router.use('/api/variations', variationsRoute)
router.use('/api/products', productsRoute)

export { router }