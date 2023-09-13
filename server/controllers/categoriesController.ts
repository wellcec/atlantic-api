import { Request, Response } from 'express'
import { CreateCategoriesRequest, GetAllCategoriesResponse } from '../models/categories'
import { CategoriesRepository } from '../repositories/categoriesRepository'
import Category from '../schemas/Category'
import codes from '../constants/codes'
import logger from '../logger/logger'
import { ObjectId } from 'mongodb'

const { Success, Error } = codes

export class CategoriesController {
  private categoriesRepository: CategoriesRepository

  constructor() {
    this.categoriesRepository = new CategoriesRepository()
  }

  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

    try {
      let categories: GetAllCategoriesResponse = await this.categoriesRepository.getAll(term, page, pageSize)
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
        id: new ObjectId(),
        name: item.name,
        createdDate: new Date()
      }))
      category.createdDate = new Date()

      await this.categoriesRepository.insert(category)
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

      const { name, subCategories }: CreateCategoriesRequest = req.body

      let category = new Category()
      category.name = name

      category.subCategories = subCategories.map((item) => ({
        id: item?.id ?? new ObjectId(),
        name: item?.name,
        createdDate: item?.createdDate ?? new Date()
      }))

      await await this.categoriesRepository.update(id, category)
      return res.status(Success).send({ message: 'Categoria atualizada com sucesso.' })
    } catch (error) {
      logger.error(`categoriesRoute put error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar categoria.` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const result = await this.categoriesRepository.delete(id)
      return res.status(Success).send({ message: `Categoria id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`categoriesRoute delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir categoria.` })
    }
  }
}