import { Controller, Get, Query, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { MastraService } from './mastra';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly mastraService: MastraService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Sse('weather')
  async getWeather(@Query('location') location: string) {
    // 测试工具调用，流式输出，LibSQL, Qwen调用
    const stream = await this.mastraService.getWeather(location);
    return new Observable((subscriber) => {
      stream.pipeTo(new WritableStream({
        write(chunk) {
          subscriber.next(JSON.stringify({ data: chunk }));
        },
        close() {
          subscriber.complete();
        },
      }));
    });
  }

  @Get('chat')
  async chat(@Query('message') message: string) {
    // 测试同步调用输出
    return this.mastraService.syncChat(message);
  }
  @Get('memo')
  async memo() {
    // 测试长短期上下文记忆，PgVector, Qwen调用
    return this.mastraService.memoTest();
  }
  @Get('rag/init')
  async ragInit() {
    // 测试RAG效果，PgVector, 阿里 Embedding
    return this.mastraService.ragInit();
  }
  @Get('rag/query')
  async ragQuery() {
    // 测试RAG效果，PgVector, 阿里 Embedding
    return this.mastraService.ragQueryTest();
  }
}
