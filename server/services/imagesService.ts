import { Request } from 'express'
import { inject, injectable } from 'tsyringe'
import { ObjectId, DeleteResult } from 'mongodb'
import { DeleteResult as DeleteResultORM } from "typeorm"
const formidable = require('formidable')
import { Client } from 'basic-ftp'
const sharp = require('sharp')
const fs = require('fs')

import Image from '../schemas/Image'
import codes from '../constants/codes'
import { ReturnFeedbackType } from '../models/products'
import { ftpServerInfo } from '../config/FtpConnection'
import IImagesRepository from '../interfaces/IImagesRepository'

const { Success, Error, SomethingWrong } = codes

@injectable()
export class ImagesService {
  constructor(
    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository
  ) { }

  public getAll = async (): Promise<{ data: Image[] }> => {
    return await this.imagesRepository.getAll()
  }

  public getById = async (id: ObjectId): Promise<any> => {
    return await this.imagesRepository.getById(id)
  }

  public deleteOne = async (id: ObjectId): Promise<DeleteResultORM> => {
    return await this.imagesRepository.deleteOne(id)
  }

  public delete = async (): Promise<DeleteResult> => {
    return await this.imagesRepository.delete()
  }

  public saveTempImages = async (req: Request): Promise<ReturnFeedbackType> => {
    const form = new formidable.IncomingForm()

    const errorMsg = {
      message: 'Erro ao processar o upload do arquivo.',
      code: Error,
    }

    await form.parse(req, async (err, _, files) => {
      if (err) {
        return errorMsg
      }

      if (files.files.length === 0) {
        return {
          message: 'Nenhum arquivo enviado.',
          code: SomethingWrong,
        }
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

            return {
              message: 'Imagem salva.',
              code: Success,
              image: result
            }
          })
      }
    })

    return errorMsg
  }
}