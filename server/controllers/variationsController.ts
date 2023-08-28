import { GetAllVariationsResponse } from '../models/variations'
import { VariationsRepository } from '../repositories/variationsRepository'
import Variations from '../schemas/Variations'

export class VariationsController {
  private variationsRepository: VariationsRepository

  constructor() {
    this.variationsRepository = new VariationsRepository()
  }

  public async getAllVariations(term: string, page: number, pageSize: number): Promise<GetAllVariationsResponse> {
    return await this.variationsRepository.getAll(term, page, pageSize)
  }

  public async insertVariation(variation: Variations) {
    return await this.variationsRepository.insert(variation)
  }

  public async deleteVariation(id: string) {
    return await this.variationsRepository.delete(id)
  }
}