import { Router, Request, Response } from 'express'
import { CategoriesController } from '../controllers/categoriesController'
import Category from '../schemas/Category'
import logger from '../logger/logger'
import codes from '../constants/codes'
import { CreateCategoriesRequest } from '../models/categories'
import { ObjectId } from 'mongodb'

const { Success, Error } = codes
const categoriesRoute = Router()
const controller = new CategoriesController()

categoriesRoute.get('', async (req: Request, res: Response) => {
  const term = req.query?.term?.toString() ?? ''
  const page = Number.parseInt(req.query?.page?.toString() ?? '1')
  const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

  try {
    let categorys = await controller.getAllCategories(term, page, pageSize)
    return res.status(Success).send(categorys)
  } catch (error) {
    logger.error(`categoriesRoute get error ==> ${error}`)
    return res.status(Error).send(error)
  }
})

categoriesRoute.post('', async (req: Request, res: Response) => {
  try {
    const { name, subCategories }: CreateCategoriesRequest = req.body

    let category = new Category()
    category.name = name
    category.subCategories = subCategories.map((item) => ({
      id: new ObjectId(),
      name: item.name,
      createdDate: new Date()
    }))
    category.createdDate = new Date()

    await controller.insertCategory(category)
    return res.status(Success).send(category)
  }
  catch (error) {
    logger.error(`categoriesRoute create error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao criar categoria. ${error.message}` })
  }
})

categoriesRoute.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}

    const { name, subCategories }: CreateCategoriesRequest = req.body

    let category = new Category()
    category.name = name

    category.subCategories = subCategories.map((item) => ({
      id: item?.id ?? new ObjectId(),
      name: item?.name,
      createdDate: item?.createdDate ?? new Date()
    }))

    await controller.updateCategory(id, category)
    return res.status(Success).send({ message: 'Categoria atualizada com sucesso.' })
  } catch (error) {
    logger.error(`categoriesRoute put error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao atualizar categoria. ${error.message}` })
  }
})

categoriesRoute.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}
    const result = await controller.deleteCategory(id)
    return res.status(Success).send({ message: `Categoria id:${id} foi excluído.`, ...result })
  }
  catch (error) {
    logger.error(`categoriesRoute delete error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao excluir categoria. ${error.message}` })
  }
})

export default categoriesRoute
