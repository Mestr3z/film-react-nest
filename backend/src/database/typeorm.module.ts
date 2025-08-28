import { Module, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FilmEntity } from '../repository/typeorm/film.entity';
import { ScheduleEntity } from '../repository/typeorm/schedule.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        const driver =
          process.env.DATABASE_DRIVER ?? process.env.DB_DRIVER ?? 'mongodb';

        if (driver !== 'postgres') {
          return {
            type: 'postgres',
            autoLoadEntities: false,
            synchronize: false,
            entities: [],
            retryAttempts: 0,
          } as TypeOrmModuleOptions;
        }

        const url = process.env.DATABASE_URL;
        const host = process.env.DATABASE_HOST ?? 'localhost';
        const port = Number(process.env.DATABASE_PORT ?? 5432);
        const username = process.env.DATABASE_USERNAME ?? 'film';
        const password = process.env.DATABASE_PASSWORD ?? '';
        const database = process.env.DATABASE_NAME ?? 'film';

        const base: TypeOrmModuleOptions = {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
          entities: [FilmEntity, ScheduleEntity],
        };

        if (url && url.length > 0) return { ...base, url };
        return { ...base, host, port, username, password, database };
      },
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeOrmModule {}
