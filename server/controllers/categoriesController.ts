import { GetAllCategoriesResponse } from '../models/categories'
import { CategoriesRepository } from '../repositories/categoriesRepository'
import Category from '../schemas/Category'

export class CategoriesController {
  private categoriesRepository: CategoriesRepository

  constructor() {
    this.categoriesRepository = new CategoriesRepository()
  }

  public async getAllCategories(term: string, page: number, pageSize: number): Promise<GetAllCategoriesResponse> {
    return await this.categoriesRepository.getAll(term, page, pageSize)
  }

  public async insertCategory(category: Category) {
    return await this.categoriesRepository.insert(category)
  }

  public async updateCategory(id: string, category: Category) {
    return await this.categoriesRepository.update(id, category)
  }

  public async deleteCategory(id: string) {
    return await this.categoriesRepository.delete(id)
  }
}