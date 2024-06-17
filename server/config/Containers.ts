import { container } from 'tsyringe'

import ICategoriesRepository from '../interfaces/ICategoriesRepository'
import IProductsRepository from '../interfaces/IProductsRepository'
import IImagesRepository from '../interfaces/IImagesRepository'
import IUsersRepository from '../interfaces/IUsersRepository'
import IVariationsRepository from '../interfaces/IVariationsRepository'

import { ImagesRepository } from '../repositories/imagesRepository'
import { CategoriesRepository } from '../repositories/categoriesRepository'
import { ProductsRepository } from '../repositories/productsRepository'
import { UsersRepository } from '../repositories/usersRepository'
import { VariationsRepository } from '../repositories/variationsRepository'

export default function registerSingletons() {
  container.registerSingleton<ICategoriesRepository>(
    'CategoriesRepository',
    CategoriesRepository
  );
  container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
  );
  container.registerSingleton<IImagesRepository>(
    'ImagesRepository',
    ImagesRepository
  );
  container.registerSingleton<IProductsRepository>(
    'ProductsRepository',
    ProductsRepository
  );
  container.registerSingleton<IVariationsRepository>(
    'VariationsRepository',
    VariationsRepository
  );
}
