import { Router, Request, Response } from 'express'
const fs = require("fs")
const formidable = require('formidable')

import { Client } from 'basic-ftp'

import logger from '../logger/logger'
import codes from '../constants/codes'
import { ftpServerInfo } from '../config/FtpConnection'
import { ProductsController } from '../controllers/productsController'
import Image from '../schemas/Image'
const { SomethingWrong, Success, Error } = codes

const productsRoute = Router()
const controller = new ProductsController()

productsRoute.post('/upload', async (req: Request, res: Response) => {
  try {
    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(Error).send({ message: 'Erro ao processar o upload do arquivo.' })
      }

      if (files.files.length === 0) {
        return res.status(SomethingWrong).send({ message: 'Nenhum arquivo enviado.' })
      }

      const ftp = new Client()

      for (const file of files.files || []) {
        await ftp.access(ftpServerInfo)
          .then(() => ftp.cd('/images'))
          .then(() => ftp.uploadFrom(fs.createReadStream(file.filepath), file.originalFilename))
          .then(async () => {
            fs.readFile(file.filepath, 'base64', async (_, data) => {
              const base64Image = `data:image/png;base64,${data}`

              const newImage = new Image()
              newImage.fileName = file.originalFilename
              newImage.base64 = base64Image
              newImage.createdDate = new Date()

              await controller.insertImages(newImage)

              ftp.close()
            })
          })
      }

      return res.status(Success).send({ message: 'Arquivos enviados com sucesso.' })
    })

  } catch (error) {
    logger.error(`productsRoute upload image error ==> ${error}`)
    return res.status(Error).send({ message: 'Ocorreu um erro ao processar as imagens.' })
  }
})

export default productsRoute
