import { Router } from 'express'
import { UsersController } from '../controllers/usersController'

const usersRouter = Router()
const controller = new UsersController()

usersRouter.get('', controller.getAll)
usersRouter.post('', controller.create)
usersRouter.put('/:id', controller.update)
usersRouter.delete('/:id', controller.delete)

export default usersRouter
