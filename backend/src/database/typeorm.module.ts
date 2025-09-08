import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FilmEntity } from '../repository/typeorm/film.entity';
import { ScheduleEntity } from '../repository/typeorm/schedule.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const driver = (
          cfg.get<string>('DATABASE_DRIVER') || 'postgres'
        ).toLowerCase();

        if (driver !== 'postgres') {
          return {
            autoLoadEntities: false,
            type: 'postgres',
            keepConnectionAlive: false,
            entities: [],
            synchronize: false,
            migrationsRun: false,
            host: '127.0.0.1',
            port: 5432,
            username: 'none',
            password: 'none',
            database: 'none',
            connectTimeoutMS: 1,
          } as any;
        }
        const url = cfg.get<string>('DATABASE_URL');

        if (url) {
          return {
            type: 'postgres',
            url,
            entities: [FilmEntity, ScheduleEntity],
            synchronize: true,
          };
        }

        return {
          type: 'postgres',
          host: cfg.get<string>('DATABASE_HOST', 'localhost'),
          port: cfg.get<number>('DATABASE_PORT', 5432),
          username: cfg.get<string>('DATABASE_USERNAME', 'film'),
          password: cfg.get<string>('DATABASE_PASSWORD', 'film'),
          database: cfg.get<string>('DATABASE_NAME', 'film'),
          entities: [FilmEntity, ScheduleEntity],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeOrmModule {}
