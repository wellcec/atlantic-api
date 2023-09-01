import { Router, Request, Response } from 'express'
const fs = require('fs')
const formidable = require('formidable')
const sharp = require('sharp')

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
          .then(async () => {
            let newFile = null
            let path = ''

            if ((file.size / 1000) > 1000) {
              newFile = await sharp(file.filepath).png({ quality: 20 })
              path = newFile?.options?.input?.file || ''
            } else {
              newFile = await fs.createReadStream(file.filepath)
              path = file.filepath
            }

            const newImage = new Image()
            newImage.fileName = file.originalFilename
            newImage.createdDate = new Date()

            await controller.insertImages(newImage)
            return ftp.uploadFrom(newFile, file.originalFilename)
          })
          .then(async (res) => {
            console.log(res)
            ftp.close()
          })
      }

      return res.status(Success).send({ message: 'Arquivos enviados com sucesso.' })
    })

  } catch (error) {
    logger.error(`productsRoute upload image error ==> ${error}`)
    return res.status(Error).send({ message: 'Ocorreu um erro ao processar as imagens.' })
  }
})

productsRoute.get('/images', async (req: Request, res: Response) => {
  try {
    let images = await controller.getAllImages()
    return res.status(Success).send(images)
  } catch (error) {
    logger.error(`productsRoute get all images error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao buscar imagens.` })
  }
})

productsRoute.post('/images/tobase64', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.body

    const ftp = new Client()

    await ftp.access(ftpServerInfo)
    const buffer = await ftp.download('temp.png', fileName)

    const imageBuffer = fs.readFileSync('temp.png');
    const base64Image = imageBuffer.toString('base64');

    // Remover o arquivo temporário
    fs.unlinkSync('temp.png');

    return res.status(Success).send({ base64Image: base64Image })
  } catch (error) {
    logger.error(`productsRoute get uploaded images error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao buscar imagens.` })
  }
})

productsRoute.delete('/images/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}

    const image: Image = await controller.getImageById(id)
    const ftp = new Client()
    await ftp.access(ftpServerInfo)

    await ftp.remove(image.fileName)

    await controller.deleteImage(id)

    return res.status(Success).send({ message: `Imagem id: ${id} foi excluída.` })
  }
  catch (error) {
    logger.error(`productsRoute delete image error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao excluir imagem.` })
  }
})

export default productsRoute
