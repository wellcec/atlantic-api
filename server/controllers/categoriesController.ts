import { Request, Response } from 'express'
import { CreateCategoriesRequest, GetAllCategoriesResponse } from '../models/categories'
import { CategoriesRepository } from '../repositories/categoriesRepository'
import { ProductsRepository } from '../repositories/productsRepository'
import Category from '../schemas/Category'
import codes from '../constants/codes'
import logger from '../logger/logger'
import { genId } from '../shared/utils'

const { Success, Error } = codes

export class CategoriesController {
  private categoriesRepository: CategoriesRepository
  private productsRepository: ProductsRepository

  constructor() {
    this.categoriesRepository = new CategoriesRepository()
    this.productsRepository = new ProductsRepository()
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
        _id: genId(),
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
      const currentId = genId(id)

      const { name, subCategories }: CreateCategoriesRequest = req.body

      let existentCategory = await this.categoriesRepository.getById(currentId)
      existentCategory.name = name
      existentCategory.updatedDate = new Date()

      existentCategory.subCategories = subCategories.map((item) => ({
        _id: genId(item?._id),
        name: item?.name,
        createdDate: item?.createdDate ?? new Date()
      }))

      logger.info(`categoriesRoute put updating products...`)
      const products = await this.productsRepository.getByCategoryId(currentId)
      if (products.length > 0) {
        for (const currentProduct of products) {
          const idProduct = currentProduct._id
          const categories = currentProduct.categories.filter((item) => item._id.toString() !== id)
          const existentCategoryProduct = currentProduct.categories.find((item) => item._id.toString() === id)

          if (existentCategoryProduct) {
            const idsSubCats = existentCategoryProduct.subCategories.map((item) => item._id)
            const newSubcategories = existentCategoryProduct.subCategories.filter((item) => idsSubCats.includes(item._id))

            categories.push({
              ...existentCategory,
              subCategories: newSubcategories
            })
          }

          console.log('categories', JSON.stringify(categories))
          await this.productsRepository.update(idProduct, {
            ...currentProduct,
            categories
          })
        }
      }

      logger.info(`categoriesRoute put updating category...`)
      await this.categoriesRepository.update(currentId, existentCategory)
      return res.status(Success).send({ message: 'Categoria atualizada com sucesso.' })
    } catch (error) {
      logger.error(`categoriesRoute put error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar categoria.` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const result = await this.categoriesRepository.delete(genId(id))
      return res.status(Success).send({ message: `Categoria id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`categoriesRoute delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir categoria.` })
    }
  }
}