import { DataSource } from 'typeorm';
import { InMemoryFilmsRepository } from './inmemory-films.repository';
import { TypeOrmFilmsRepository } from './typeorm/typeorm-films.repository';
import { AppConfig } from '../app.config.provider';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export const filmsRepositoryProvider = {
  provide: FILMS_REPOSITORY,
  inject: [DataSource, 'CONFIG'],
  useFactory: async (ds: DataSource, config: AppConfig) => {
    const driver = (config.database.driver || '').toLowerCase();

    if (driver === 'postgres') {
      return new TypeOrmFilmsRepository(ds);
    }
    return new InMemoryFilmsRepository();
  },
};
