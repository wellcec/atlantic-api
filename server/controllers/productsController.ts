import { Request, Response } from 'express'
const fs = require('fs')
import { Client } from 'basic-ftp'
import { container } from 'tsyringe'

import Image from '../schemas/Image'
import Product from '../schemas/Product'
import { ftpServerInfo } from '../config/FtpConnection'
import { CreateProductRequest, ProductsByCategoryList, ProductsList, UpdateProductRequest, UpdateStatusRequest } from '../models/products'

import logger from '../logger/logger'
import codes from '../constants/codes'
import { genId } from '../shared/utils'
import { ImagesService } from '../services/imagesService'
import { ProductsService } from '../services/productsService'

const { Success, Error, SomethingWrong } = codes

export class ProductsController {
  public getAll = async (req: Request, res: Response) => {
    const term = req.query?.term?.toString() ?? ''
    const page = Number.parseInt(req.query?.page?.toString() ?? '1')
    const pageSize = Number.parseInt(req.query?.pageSize?.toString() ?? '10')

    try {
      const productsService = container.resolve(ProductsService)
      let products = await productsService.getAll(term, page, pageSize)
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

      const productsService = container.resolve(ProductsService)
      const imagesService = container.resolve(ImagesService)
      await productsService.insert(product)
      await imagesService.delete()

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

      const productsService = container.resolve(ProductsService)
      const imagesService = container.resolve(ImagesService)

      let product = await productsService.getById(currentId)
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
      await productsService.update(currentId, product)

      logger.info(`productsRoute update error ==> clearing temp images...`)
      await imagesService.delete()

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

      const productsService = container.resolve(ProductsService)
      const product: UpdateProductRequest = await productsService.getById(currentId)
      product.status = {
        ...product.status,
        ...status
      }

      const result = await productsService.update(currentId, product)

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

      const productsService = container.resolve(ProductsService)
      const result = await productsService.delete(genId(id))

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

      const productsService = container.resolve(ProductsService)
      const product = await productsService.getById(genId(id))

      return res.status(Success).send(product)
    } catch (error) {
      logger.error(`productsRoute getById error ==> ${error}`)
      return res.status(Error).send({ message: `Erro ao buscar produto.` })
    }
  }

  public saveTempImages = async (req: Request, res: Response) => {
    try {
      const imagesService = container.resolve(ImagesService)
      const result = await imagesService.saveTempImages(req)

      if (result?.code === Success) {
        return res.status(Success).send(result?.image)
      }

      return res.status(result?.code).send({ message: result?.message })
    } catch (error) {
      logger.error(`productsRoute upload image error ==> ${error}`)
      return res.status(Error).send({ message: 'Ocorreu um erro ao processar as imagens.' })
    }
  }

  public getTempImages = async (req: Request, res: Response) => {
    try {
      const imagesService = container.resolve(ImagesService)
      let images = await imagesService.getAll()

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
      const productsService = container.resolve(ProductsService)
      const product: Product = await productsService.getById(currentId)
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

        const productsService = container.resolve(ProductsService)
        await productsService.update(currentId, updatedProduct)

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

      const imagesService = container.resolve(ImagesService)
      const image: Image = await imagesService.getById(currentId)
      const ftp = new Client()
      await ftp.access(ftpServerInfo)

      await ftp.remove(image.fileName)

      await imagesService.deleteOne(currentId)

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

      const productsService = container.resolve(ProductsService)
      let products = await productsService.getByCategoryId(currentId)

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