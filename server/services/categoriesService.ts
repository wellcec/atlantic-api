import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'mongodb'
import { DeleteResult } from 'typeorm'

import logger from '../logger/logger'
import { genId } from '../shared/utils'
import Category from '../schemas/Category'
import SubCategory from '../schemas/SubCategory'
import { GetAllCategoriesResponse } from '../models/categories'
import IProductsRepository from '../interfaces/IProductsRepository'
import ICategoriesRepository from '../interfaces/ICategoriesRepository'

@injectable()
export class CategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository
  ) { }

  public getAll = async (term: string, page: number, pageSize: number): Promise<GetAllCategoriesResponse | undefined> => {
    return await this.categoriesRepository.getAll(term, page, pageSize)
  }

  public create = async (category: Category): Promise<Category> => {
    return await this.categoriesRepository.insert(category)
  }

  public getById = async (id: ObjectId): Promise<Category> => {
    return await this.categoriesRepository.getById(id)
  }

  public update = async (reqId: string, currentId: ObjectId, name: string, subCategories: SubCategory[]): Promise<void> => {
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
        const categories = currentProduct.categories.filter((item) => item._id.toString() !== reqId)
        const existentCategoryProduct = currentProduct.categories.find((item) => item._id.toString() === reqId)

        if (existentCategoryProduct) {
          const idsSubCats = existentCategoryProduct.subCategories.map((item) => item._id)
          const newSubcategories = existentCategoryProduct.subCategories.filter((item) => idsSubCats.includes(item._id))

          categories.push({
            ...existentCategory,
            subCategories: newSubcategories
          })
        }

        await this.productsRepository.update(idProduct, {
          ...currentProduct,
          categories
        })
      }
    }

    logger.info(`categoriesRoute put updating category...`)
    await this.categoriesRepository.update(currentId, existentCategory)
  }

  public delete = async (id: ObjectId): Promise<DeleteResult> => {
    return await this.categoriesRepository.delete(id)
  }
}