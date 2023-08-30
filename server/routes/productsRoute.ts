import { Router } from 'express'
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

productsRoute.post('/upload', async (req: any, res) => {
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
            const newImage = new Image()
            newImage.fileName = file.originalFilename
            newImage.createdDate = new Date()

            await controller.insertImages(newImage)

            ftp.close()
          })
      }

      return res.status(Success).send({ message: 'Arquivos enviados com sucesso.' })
    })

  } catch (error) {
    logger.error(`productsRoute upload error ==> ${error}`)
    return res.status(Error).send({ message: 'Ocorreu um erro ao processar as imagens.' })
  }
})

// Intermediate route for files
// app.get('/image/:filename', (req, res) => {
//   const ftpUrl = `ftp://user:password@your-ftp-server/${req.params.filename}`;

//   request.get(ftpUrl).pipe(res);
// });

export default productsRoute
