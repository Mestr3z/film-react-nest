import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: 'postgres',
      url:
        process.env.DATABASE_URL ?? 'postgres://film:film@localhost:5432/film',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USERNAME ?? 'film',
      password: process.env.DATABASE_PASSWORD ?? 'film',
      name: process.env.DATABASE_NAME ?? 'film',
    },
    port: Number(process.env.PORT ?? 3000),
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}
export interface AppConfigDatabase {
  driver: 'postgres' | string;
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}
