import { Injectable } from '@nestjs/common';
import { createOpenAI } from '@ai-sdk/openai';
import { createQwen } from 'qwen-ai-provider';
import { ConfigurationService } from '../../config/configuration';

@Injectable()
export class QwenService {
  private qwen;
  private openai;

  constructor(private configService: ConfigurationService) {
    this.qwen = createQwen(this.configService.qwenConfig);
    this.openai = createOpenAI(this.configService.openaiConfig);
  }

  getQwen() {
    return this.qwen;
  }

  getOpenAI() {
    return this.openai;
  }
}