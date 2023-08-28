import { Router, Request, Response } from 'express'
import { UsersController } from '../controllers/usersController'
import Users from '../schemas/Users'
import logger from '../logger/logger'
import codes from '../constants/codes'
import { CreateUserRequest } from '../models/users'

const usersRouter = Router()
const usersService = new UsersController()

usersRouter.get('', async (req: Request, res: Response) => {
  const term = req.query?.term?.toString()
  const page = Number.parseInt(req.query?.page?.toString() || '1')
  const pageSize = Number.parseInt(req.query?.pageSize?.toString() || '20')

  try {
    let users = await usersService.getAllUsers(term, page, pageSize)
    res.status(codes.codeSuccess).send(users)
  } catch (error) {
    logger.error(`usersRouter get error ==> ${error}`)

    res.status(codes.codeError).send(error)
  }
})

usersRouter.post('', async (req: Request, res: Response) => {
  try {
    const { name, document }: CreateUserRequest = req.body

    let user = new Users()
    user.name = name
    user.document = document
    user.createdDate = new Date()

    await usersService.insertUser(user)
    return res.status(codes.codeSuccess).send(user)
  }
  catch (error) {
    logger.error(`usersRouter create error ==> ${error}`)
    return res.status(codes.codeError).send({ message: `Erro ao criar user. ${error.message}` })
  }
})

usersRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params || {}

    const { name, document }: CreateUserRequest = req.body

    let user = new Users()
    user.name = name
    user.document = document

    await usersService.updateUser(id, user)
    return res.status(codes.codeSuccess).send({ message: 'Usuário atualizado com sucesso.' })
  } catch (error) {
    logger.error(`usersRouter put error ==> ${error}`)
    return res.status(codes.codeError).send({ message: `Erro ao atualizar user. ${error.message}` })
  }
})

usersRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params || {}
    const result = await usersService.deleteUser(id)
    return res.status(codes.codeSuccess).send({ message: `Usuário id:${id} foi excluído.`, ...result })
  }
  catch (error) {
    logger.error(`usersRouter delete error ==> ${error}`)
    return res.status(codes.codeError).send({ message: `Erro ao excluir user. ${error.message}` })
  }
})

export default usersRouter
