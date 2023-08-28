import { Router, Request, Response } from 'express'
import { VariationsController } from '../controllers/variationsController'
import Variations from '../schemas/Variations'
import logger from '../logger/logger'
import codes from '../constants/codes'
import { CreateVariationRequest } from '../models/variations'

const variationsRoute = Router()
const controller = new VariationsController()

variationsRoute.get('', async (req: Request, res: Response) => {
  const term = req.query?.term?.toString()
  const page = Number.parseInt(req.query?.page?.toString() || '1')
  const pageSize = Number.parseInt(req.query?.pageSize?.toString() || '10')

  try {
    let variations = await controller.getAllVariations(term, page, pageSize)
    res.status(codes.codeSuccess).send(variations)
  } catch (error) {
    logger.error(`variationsRoute get error ==> ${error}`)

    res.status(codes.codeError).send(error)
  }
})

variationsRoute.post('', async (req: Request, res: Response) => {
  try {
    const { name }: CreateVariationRequest = req.body

    if (name === '') {
      return res.status(codes.codeSomethingWrong).send({
        message: 'Parâmetro "nome" é obrigatório.'
      })
    }

    let variation = new Variations()
    variation.name = name
    variation.createdDate = new Date()

    await controller.insertVariation(variation)
    return res.status(codes.codeSuccess).send(variation)
  }
  catch (error) {
    logger.error(`variationsRoute create error ==> ${error}`)
    return res.status(codes.codeError).send({ message: `Erro ao criar variação. ${error.message}` })
  }
})

variationsRoute.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params || {}
    const result = await controller.deleteVariation(id)
    return res.status(codes.codeSuccess).send({ message: `Variação id:${id} foi excluído.`, ...result })
  }
  catch (error) {
    logger.error(`variationsRoute delete error ==> ${error}`)
    return res.status(codes.codeError).send({ message: `Erro ao excluir variação. ${error.message}` })
  }
})

export default variationsRoute
