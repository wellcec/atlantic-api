import { Request, Response } from 'express'
import { CreateUserRequest, GetAllUsersRespnse } from '../models/users'
import { UsersRepository } from '../repositories/usersRepository'
import User from '../schemas/User'
import codes from '../constants/codes'
import logger from '../logger/logger'
import { genId } from '../shared/utils'
const { Success, Error } = codes

export class UsersController {
  private usersRepository

  constructor() {
    this.usersRepository = new UsersRepository()
  }

  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '20')

    try {
      let users = await this.usersRepository.getAll(term, page, pageSize)
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
      user.id = genId()
      user.name = name
      user.document = document
      user.createdDate = new Date()

      await this.usersRepository.insert(user)
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

      await this.usersRepository.update(id, user)
      return res.status(Success).send({ message: 'Usuário atualizado com sucesso.' })
    } catch (error) {
      logger.error(`usersRouter put error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar user. ${error.message}` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const result = await this.usersRepository.delete(id)
      return res.status(Success).send({ message: `Usuário id:${id} foi excluído.`, ...result })
    }
    catch (error) {
      logger.error(`usersRouter delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir user. ${error.message}` })
    }
  }
}