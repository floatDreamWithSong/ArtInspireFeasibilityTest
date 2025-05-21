import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MastraService } from './mastra';
import { ConfigurationService } from './config/configuration';
import { QwenService } from './mastra/model/qwen';
import { RagService } from './mastra/rag';
import { MemoryAgentService } from './mastra/agents/memo';
import { WeatherAgentService } from './mastra/agents/weather';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MastraService,
    ConfigurationService,
    QwenService,
    RagService,
    MemoryAgentService,
    WeatherAgentService,
  ],
})
export class AppModule {}
