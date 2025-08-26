import mongoose from 'mongoose';
import { InMemoryFilmsRepository } from './inmemory-films.repository';
import { MongoFilmsRepository } from './mongo/mongo-films.repository';
import { getFilmModel } from './mongo/film.schema';
import { AppConfig } from '../app.config.provider';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export const filmsRepositoryProvider = {
  provide: FILMS_REPOSITORY,
  inject: ['CONFIG'],
  useFactory: async (config: AppConfig) => {
    if (config.database.driver === 'mongodb') {
      await mongoose.connect(config.database.url);
      const model = getFilmModel();
      return new MongoFilmsRepository(model);
    }
    return new InMemoryFilmsRepository();
  },
};
