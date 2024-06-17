import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'mongodb'

import Variation from '../schemas/Variation'
import { GetAllVariationsResponse } from '../models/variations'
import IVariationsRepository from '../interfaces/IVariationsRepository'

@injectable()
export class VariationsService {
  constructor(
    @inject('VariationsRepository')
    private variationsRepository: IVariationsRepository
  ) { }

  public getAll = async (term: string, page: number, pageSize: number): Promise<GetAllVariationsResponse | undefined> => {
    return await this.variationsRepository.getAll(term, page, pageSize)
  }

  public insert = async (variation: Variation): Promise<Variation> => {
    return await this.variationsRepository.insert(variation)
  }

  public delete = async (id: ObjectId) => {
    return await this.variationsRepository.delete(id)
  }
}