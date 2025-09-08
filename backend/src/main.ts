import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function pickLogger(): DevLogger | JsonLogger | TskvLogger {
  const format = (process.env.LOG_FORMAT || 'dev').toLowerCase();
  switch (format) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  app.useLogger(pickLogger());

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
