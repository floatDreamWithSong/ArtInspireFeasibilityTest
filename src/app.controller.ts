import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MastraService } from './mastra/index';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly mastraService: MastraService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('weather')
  async getWeather(@Query('location') location: string): Promise<string> {
    return this.mastraService.getWeather(location);
  }

  @Get('chat')
  async chat(@Query('message') message: string): Promise<string> {
    return this.mastraService.chat(message);
  }
}
