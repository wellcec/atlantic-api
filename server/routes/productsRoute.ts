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
import { CreateProductRequest, ProductsList, UpdateStatusRequest } from '../models/products'
import Product from '../schemas/Product'
const { SomethingWrong, Success, Error } = codes

const productsRoute = Router()
const controller = new ProductsController()

productsRoute.get('', async (req: Request, res: Response) => {
  const term = req.query?.term?.toString() ?? ''
  const page = Number.parseInt(req.query?.page?.toString() ?? '1')
  const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

  try {
    let products = await controller.getAllProducts(term, page, pageSize)
    const all: ProductsList[] = products?.data?.map((product) => (
      {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        images: product.images,
        status: product.status
      }
    ))

    return res.status(Success).send({ ...products, data: all })
  } catch (error) {
    logger.error(`productsRoute get all list error ==> ${error}`)
    return res.status(Error).send(error)
  }
})

productsRoute.post('', async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      categories,
      height,
      images,
      length,
      status,
      tags,
      value,
      valueUnique,
      variations,
      weight,
      width
    }: CreateProductRequest = req.body

    let product = new Product()
    product.title = title
    product.subtitle = subtitle
    product.categories = categories
    product.height = height
    product.images = images
    product.length = length
    product.status = {
      ...status,
      isActive: false,
      isHighlighted: false,
    }
    product.tags = tags
    product.value = value
    product.valueUnique = valueUnique
    product.variations = variations
    product.weight = weight
    product.width = width
    product.createdDate = new Date()

    await controller.insertProduct(product)
    await controller.deleteTempImages()

    return res.status(Success).send(product)
  }
  catch (error) {
    logger.error(`productsRoute create error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao criar produto.` })
  }
})

productsRoute.put('/status/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}
    const { status }: UpdateStatusRequest = req.body

    const product = await controller.getProductById(id)
    product.status = {
      ...product.status,
      ...status
    }

    const result = await controller.updateProduct(id, product)

    if (result.affected > 0) {
      return res.status(Success).send(result)
    }

    return res.status(SomethingWrong).send({ message: 'Nenhum produto foi atualizado.' })
  }
  catch (error) {
    logger.error(`productsRoute update status error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao atualizar status do produto.` })
  }
})

productsRoute.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}

    const result = await controller.deleteProduct(id)

    if (result.deletedCount > 0) {
      return res.status(Success).send(result)
    }

    return res.status(SomethingWrong).send({ message: 'Nenhum produto foi excluído.' })
  }
  catch (error) {
    logger.error(`productsRoute delete error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao excluir o produto.` })
  }
})

productsRoute.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req?.params ?? {}

    const product = await controller.getProductById(id)

    return res.status(Success).send(product)
  } catch (error) {
    logger.error(`productsRoute getById error ==> ${error}`)
    return res.status(Error).send({ message: `Erro ao buscar produto.` })
  }
})

productsRoute.post('/images/upload', async (req: Request, res: Response) => {
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
            await ftp.uploadFrom(newFile, file.originalFilename, { localEndInclusive: 1, localStart: 0 })
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

productsRoute.get('/images/temp', async (req: Request, res: Response) => {
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
    // const buffer = await ftp.download('temp.png', fileName)
    const buffer = await ftp.appendFrom('temp.png', fileName)
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
