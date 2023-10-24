import { Request, Response } from 'express'

import codes from '../constants/codes'
import { CreateVariationRequest, GetAllVariationsResponse } from '../models/variations'
import { VariationsRepository } from '../repositories/variationsRepository'
import Variation from '../schemas/Variation'
import logger from '../logger/logger'
import { genId, removeId } from '../shared/utils'

const { Success, Error, SomethingWrong } = codes

export class VariationsController {
  private variationsRepository: VariationsRepository

  constructor() {
    this.variationsRepository = new VariationsRepository()
  }

  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

    try {
      let variations: GetAllVariationsResponse = await this.variationsRepository.getAll(term, page, pageSize)
      variations.data = variations.data.map(removeId)

      res.status(Success).send(variations)
    } catch (error) {
      logger.error(`variationsRoute get error ==> ${error}`)

      res.status(Error).send(error)
    }
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { name }: CreateVariationRequest = req.body

      if (name === '') {
        return res.status(SomethingWrong).send({
          message: 'Parâmetro "nome" é obrigatório.'
        })
      }

      let variation = new Variation()
      variation.name = name
      variation.createdDate = new Date()

      await this.variationsRepository.insert(variation)
      return res.status(Success).send(variation)
    }
    catch (error) {
      logger.error(`variationsRoute create error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao criar variação. ${error.message}` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const result = await this.variationsRepository.delete(genId(id))
      return res.status(Success).send({ message: `Variação id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`variationsRoute delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir variação. ${error.message}` })
    }
  }
}