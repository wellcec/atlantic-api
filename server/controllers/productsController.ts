import { Request, Response } from 'express'
const fs = require('fs')
const formidable = require('formidable')
const sharp = require('sharp')
import { Client } from 'basic-ftp'

import { ftpServerInfo } from '../config/FtpConnection'
import { CreateProductRequest, ProductsByCategoryList, ProductsList, UpdateProductRequest, UpdateStatusRequest } from '../models/products'
import { ImagesRepository } from '../repositories/imagesRepository'
import { ProductsRepository } from '../repositories/productsRepository'
import Image from '../schemas/Image'
import Product from '../schemas/Product'

import codes from '../constants/codes'
import logger from '../logger/logger'
import { genId } from '../shared/utils'

const { Success, Error, SomethingWrong } = codes

export class ProductsController {
  private imagesRepository: ImagesRepository
  private productsRepository: ProductsRepository

  constructor() {
    this.imagesRepository = new ImagesRepository()
    this.productsRepository = new ProductsRepository()
  }

  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

    try {
      let products = await this.productsRepository.getAll(term, page, pageSize)
      const all: ProductsList[] = products?.data?.map((product) => (
        {
          _id: product._id,
          title: product.title,
          subtitle: product.subtitle,
          images: product.images,
          status: product.status,
          value: product.value,
          valueUnique: product.valueUnique
        }
      ))

      return res.status(Success).send({ ...products, data: all })
    } catch (error) {
      logger.error(`productsRoute get all list error ==> ${error}`)
      return res.status(Error).send(error)
    }
  }

  public create = async (req: Request, res: Response) => {
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
        width,
        shipping
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
      product.shipping = shipping
      product.createdDate = new Date()

      await this.productsRepository.insert(product)
      await this.imagesRepository.delete()

      return res.status(Success).send(product)
    }
    catch (error) {
      logger.error(`productsRoute create error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao criar produto.` })
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const currentId = genId(id)

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
        width,
        shipping
      }: CreateProductRequest = req.body

      let product = await this.productsRepository.getById(currentId)
      product.title = title
      product.subtitle = subtitle
      product.categories = categories
      product.height = height
      product.images = images
      product.length = length
      product.status = status
      product.tags = tags
      product.value = value
      product.valueUnique = valueUnique
      product.variations = variations
      product.weight = weight
      product.width = width
      product.shipping = shipping
      product.updatedDate = new Date()

      logger.info(`productsRoute update ==> updating...`)
      await this.productsRepository.update(currentId, product)

      logger.info(`productsRoute update error ==> clearing temp images...`)
      await this.imagesRepository.delete()

      return res.status(Success).send(product)
    }
    catch (error) {
      logger.error(`productsRoute update error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar produto.` })
    }
  }

  public updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const currentId = genId(id)
      const { status }: UpdateStatusRequest = req.body

      const product: UpdateProductRequest = await this.productsRepository.getById(currentId)
      product.status = {
        ...product.status,
        ...status
      }

      const result = await this.productsRepository.update(currentId, product)

      if (result.affected > 0) {
        return res.status(Success).send(result)
      }

      return res.status(SomethingWrong).send({ message: 'Nenhum produto foi atualizado.' })
    }
    catch (error) {
      logger.error(`productsRoute update status error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao atualizar status do produto.` })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}

      const result = await this.productsRepository.delete(genId(id))

      if (result.affected > 0) {
        return res.status(Success).send(result)
      }

      return res.status(SomethingWrong).send({ message: 'Nenhum produto foi excluído.' })
    }
    catch (error) {
      logger.error(`productsRoute delete error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir o produto.` })
    }
  }

  public getById = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}

      const product = await this.productsRepository.getById(genId(id))

      return res.status(Success).send(product)
    } catch (error) {
      logger.error(`productsRoute getById error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao buscar produto.` })
    }
  }

  public saveTempImages = async (req: Request, res: Response) => {
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
        let result = new Image()

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

              result = await this.imagesRepository.insert(newImage)
              await ftp.uploadFrom(newFile, file.originalFilename, { localEndInclusive: 1, localStart: 0 })
              ftp.close()
            })
        }

        return res.status(Success).send(result)
      })

    } catch (error) {
      logger.error(`productsRoute upload image error ==> ${error}`)
      return res.status(Error).send({ message: 'Ocorreu um erro ao processar as imagens.' })
    }
  }

  public getTempImages = async (req: Request, res: Response) => {
    try {
      let images = await this.imagesRepository.getAll()

      return res.status(Success).send(images)
    } catch (error) {
      logger.error(`productsRoute get all images error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao buscar imagens.` })
    }
  }

  public getImageInBase64 = async (req: Request, res: Response) => {
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
  }

  public deleteImageOfProduct = async (req: Request, res: Response) => {
    try {
      const { idProduct, idImage } = req?.params ?? {}

      if (!idProduct || !idImage) {
        return res.status(SomethingWrong).send({ message: 'Parâmetros não informados.' })
      }

      const currentId = genId(idProduct)
      const product: Product = await this.productsRepository.getById(currentId)
      const images: Image[] = product?.images ?? []

      if (images.length === 1) {
        return res.status(SomethingWrong).send({ message: 'Produto deve possuir ao menos uma imagem.' })
      }

      const image = images?.find((img) => img?._id?.toString() === idImage)
      const newImages = images?.filter((img) => img?._id?.toString() !== idImage)

      if (image) {
        const ftp = new Client()
        await ftp.access(ftpServerInfo)
        await ftp.remove(image.fileName)

        const updatedProduct: UpdateProductRequest = product
        updatedProduct.images = newImages
        updatedProduct.updatedDate = new Date()

        await this.productsRepository.update(currentId, updatedProduct)

        return res.status(Success).send({ message: `Imagem id: ${idImage} foi excluída.` })
      }
    }
    catch (error) {
      logger.error(`productsRoute delete image temporary error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir imagem temporária.` })
    }
  }

  public deleteTempImageById = async (req: Request, res: Response) => {
    try {
      const { id } = req?.params ?? {}
      const currentId = genId(id)

      const image: Image = await this.imagesRepository.getById(currentId)
      const ftp = new Client()
      await ftp.access(ftpServerInfo)

      await ftp.remove(image.fileName)

      await this.imagesRepository.deleteOne(currentId)

      return res.status(Success).send({ message: `Imagem id: ${id} temporária foi excluída.` })
    }
    catch (error) {
      logger.error(`productsRoute delete image temporary error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao excluir imagem temporária.` })
    }
  }

  public getProductsByCategory = async (req: Request, res: Response) => {
    try {
      const { idCategory } = req?.params ?? {}
      const currentId = genId(idCategory)

      let products = await this.productsRepository.getByCategoryId(currentId)

      const all: ProductsByCategoryList[] = products?.map((product) => (
        {
          _id: product._id,
          title: product.title
        }
      ))

      return res.status(Success).send({
        data: all,
        page: 1,
        pageSize: 1000,
        count: all.length
      })
    } catch (error) {
      logger.error(`productsRoute get by category list error ==> ${error}`)
      return res.status(Error).send(error)
    }
  }
}