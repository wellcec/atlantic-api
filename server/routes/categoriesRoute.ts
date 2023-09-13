import { Router } from 'express'
import { CategoriesController } from '../controllers/categoriesController'

const categoriesRoute = Router()
const controller = new CategoriesController()

categoriesRoute.get('', controller.getAll)
categoriesRoute.post('', controller.create)
categoriesRoute.put('/:id', controller.update)
categoriesRoute.delete('/:id', controller.delete)

export default categoriesRoute
