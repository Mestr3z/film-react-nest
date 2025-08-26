import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: process.env.DB_DRIVER ?? 'mongo',
      url: process.env.DB_URL ?? 'mongodb://localhost:27017/afisha',
    },
    port: Number(process.env.PORT ?? 3000),
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}
export interface AppConfigDatabase {
  driver: string;
  url: string;
}
