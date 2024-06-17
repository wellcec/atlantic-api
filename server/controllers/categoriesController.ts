import { Request, Response } from 'express'
import { container } from 'tsyringe'

import logger from '../logger/logger'
import codes from '../constants/codes'
import { genId } from '../shared/utils'
import Category from '../schemas/Category'
import { CategoriesService } from '../services/categoriesService'
import { CreateCategoriesRequest, GetAllCategoriesResponse } from '../models/categories'

const { Success, Error } = codes

export class CategoriesController {
  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

    try {
      const categoriesService = container.resolve(CategoriesService)
      let categories: GetAllCategoriesResponse = await categoriesService.getAll(term, page, pageSize)

      return res.status(Success).send(categories)
    } catch (error) {
      logger.error(`categoriesRoute get error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao buscar categorias.` })
    }
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { name, subCategories }: CreateCategoriesRequest = req.body

      let category = new Category()
      category.name = name
      category.subCategories = subCategories.map((item) => ({
        _id: genId(),
        name: item.name,
        createdDate: new Date()
      }))
      category.createdDate = new Date()

      const categoriesService = container.resolve(CategoriesService)
      await categoriesService.create(category)
      return res.status(Success).send(category)
    }
    catch (error) {
      logger.error(`categoriesRoute create error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao criar categoria.` })
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const currentId = genId(id)

      const { name, subCategories }: CreateCategoriesRequest = req.body
      const categoriesService = container.resolve(CategoriesService)
      await categoriesService.update(id, currentId, name, subCategories)

      return res.status(Success).send({ message: 'Categoria atualizada com sucesso.' })
    } catch (error) {
      logger.error(`categoriesRoute put error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar categoria.` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}

      const categoriesService = container.resolve(CategoriesService)
      const result = await categoriesService.delete(genId(id))
      return res.status(Success).send({ message: `Categoria id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`categoriesRoute delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir categoria.` })
    }
  }
}