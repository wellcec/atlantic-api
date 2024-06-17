import { Request, Response } from 'express'
import { container } from 'tsyringe'

import User from '../schemas/User'
import logger from '../logger/logger'
import codes from '../constants/codes'
import { genId, removeId } from '../shared/utils'
import { CreateUserRequest } from '../models/users'
import { UsersService } from '../services/usersService'

const { Success, Error } = codes

export class UsersController {
  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '20')

    try {
      const usersService = container.resolve(UsersService)
      let users = await usersService.getAll(term, page, pageSize)
      users.data = users.data.map(removeId)

      return res.status(Success).send(users)
    } catch (error) {
      logger.error(`usersRouter get error ==> ${error}`)
      return res.status(Error).send(error)
    }
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { name, document }: CreateUserRequest = req.body

      let user = new User()
      user.name = name
      user.document = document
      user.createdDate = new Date()

      const usersService = container.resolve(UsersService)
      await usersService.insert(user)
      return res.status(Success).send(user)
    }
    catch (error) {
      logger.error(`usersRouter create error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao criar user. ${error.message}` })
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}

      const { name, document }: CreateUserRequest = req.body

      let user = new User()
      user.name = name
      user.document = document

      const usersService = container.resolve(UsersService)
      await usersService.update(genId(id), user)
      return res.status(Success).send({ message: 'Usuário atualizado com sucesso.' })
    } catch (error) {
      logger.error(`usersRouter put error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar user. ${error.message}` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const usersService = container.resolve(UsersService)
      const result = await usersService.delete(genId(id))
      return res.status(Success).send({ message: `Usuário id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`usersRouter delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir user. ${error.message}` })
    }
  }
}