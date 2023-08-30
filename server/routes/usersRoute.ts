import { Router, Request, Response } from 'express'
import { UsersController } from '../controllers/usersController'
import User from '../schemas/User'
import logger from '../logger/logger'
import codes from '../constants/codes'
import { CreateUserRequest } from '../models/users'

const { Success, Error } = codes
const usersRouter = Router()
const controller = new UsersController()

usersRouter.get('', async (req: Request, res: Response) => {
  const term = req.query?.term?.toString() ?? ''
  const page = Number.parseInt(req.query?.page?.toString() ?? '1')
  const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '20')

  try {
    let users = await controller.getAllUsers(term, page, pageSize)
    return res.status(Success).send(users)
  } catch (error) {
    logger.error(`usersRouter get error ==> ${error}`)
    return res.status(Error).send(error)
  }
})

usersRouter.post('', async (req: Request, res: Response) => {
  try {
    const { name, document }: CreateUserRequest = req.body

    let user = new User()
    user.name = name
    user.document = document
    user.createdDate = new Date()

    await controller.insertUser(user)
    return res.status(Success).send(user)
  }
  catch (error) {
    logger.error(`usersRouter create error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao criar user. ${error.message}` })
  }
})

usersRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}

    const { name, document }: CreateUserRequest = req.body

    let user = new User()
    user.name = name
    user.document = document

    await controller.updateUser(id, user)
    return res.status(Success).send({ message: 'Usuário atualizado com sucesso.' })
  } catch (error) {
    logger.error(`usersRouter put error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao atualizar user. ${error.message}` })
  }
})

usersRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}
    const result = await controller.deleteUser(id)
    return res.status(Success).send({ message: `Usuário id:${id} foi excluído.`, ...result })
  }
  catch (error) {
    logger.error(`usersRouter delete error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao excluir user. ${error.message}` })
  }
})

export default usersRouter
