import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      QWEN_API_KEY: string;
      QWEN_BASE_URL: string;
      OPENAI_API_KEY: string;
      OPENAI_BASE_URL: string;
      PG_VECTOR_CONNECTION_STRING: string;
      PORT?: number;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
