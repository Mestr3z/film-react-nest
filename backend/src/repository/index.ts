import { DataSource } from 'typeorm';
import { InMemoryFilmsRepository } from './inmemory-films.repository';
import { AppConfig } from '../app.config.provider';
import { TypeOrmFilmsRepository } from './typeorm/typeorm-films.repository';
import { FilmEntity } from './typeorm/film.entity';
import { ScheduleEntity } from './typeorm/schedule.entity';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export const filmsRepositoryProvider = {
  provide: FILMS_REPOSITORY,
  inject: ['CONFIG'],
  useFactory: async (config: AppConfig) => {
    if ((config.database.driver || '').toLowerCase() === 'postgres') {
      const ds = new DataSource({
        type: 'postgres',
        url: config.database.url,
        synchronize: false,
        logging: false,
        entities: [FilmEntity, ScheduleEntity],
      });

      if (!ds.isInitialized) await ds.initialize();
      return new TypeOrmFilmsRepository(ds);
    }

    return new InMemoryFilmsRepository();
  },
};
