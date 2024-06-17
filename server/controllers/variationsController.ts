import { Request, Response } from 'express'
import { container } from 'tsyringe'

import logger from '../logger/logger'
import codes from '../constants/codes'
import Variation from '../schemas/Variation'
import { genId, removeId } from '../shared/utils'
import { VariationsService } from '../services/variationsService'
import { CreateVariationRequest, GetAllVariationsResponse } from '../models/variations'

const { Success, Error, SomethingWrong } = codes

export class VariationsController {
  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

    try {
      const variationsService = container.resolve(VariationsService)
      let variations: GetAllVariationsResponse = await variationsService.getAll(term, page, pageSize)
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

      const variationsService = container.resolve(VariationsService)
      await variationsService.insert(variation)
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

      const variationsService = container.resolve(VariationsService)
      const result = await variationsService.delete(genId(id))
      return res.status(Success).send({ message: `Variação id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`variationsRoute delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir variação. ${error.message}` })
    }
  }
}