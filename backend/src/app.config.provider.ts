import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true })],
  inject: [ConfigService],
  provide: 'CONFIG',
  useFactory: (cfg: ConfigService): AppConfig => ({
    database: {
      driver: (cfg.get<string>('DATABASE_DRIVER') || 'postgres').toLowerCase(),
      url: cfg.get<string>('DATABASE_URL') || undefined,
      host: cfg.get<string>('DATABASE_HOST') || 'localhost',
      port: Number(cfg.get<string>('DATABASE_PORT') || 5432),
      username: cfg.get<string>('DATABASE_USERNAME') || 'film',
      password: cfg.get<string>('DATABASE_PASSWORD') || 'film',
      name: cfg.get<string>('DATABASE_NAME') || 'film',
    },
    port: Number(cfg.get<string>('PORT') || 3000),
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}

export interface AppConfigDatabase {
  driver: string;
  url?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  name?: string;
}
