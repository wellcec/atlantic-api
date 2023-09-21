import { Router } from 'express'

import { ProductsController } from '../controllers/productsController'
const productsRoute = Router()
const controller = new ProductsController()

productsRoute.get('', controller.getAll)
productsRoute.get('/:id', controller.getById)
productsRoute.get('/images/temporary', controller.getTempImages)
productsRoute.get('/byCategory/:idCategory', controller.getProductsByCategory)

productsRoute.post('', controller.create)
productsRoute.post('/images/upload', controller.saveTempImages)
productsRoute.post('/images/tobase64', controller.getImageInBase64)

productsRoute.put('/:id', controller.update)
productsRoute.put('/status/:id', controller.updateStatus)

productsRoute.delete('/:id', controller.delete)
productsRoute.delete('/:idProduct/images/:idImage', controller.deleteImageOfProduct)
productsRoute.delete('/images/temporary/:id', controller.deleteTempImageById)

export default productsRoute
