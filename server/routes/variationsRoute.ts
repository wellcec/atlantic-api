import { Router } from 'express';
import { VariationsController } from '../controllers/variationsController'
const variationsRoute = Router()
const controller = new VariationsController()

variationsRoute.get('', controller.getAll)
variationsRoute.post('', controller.create)
variationsRoute.delete('/:id', controller.delete)

export default variationsRoute
