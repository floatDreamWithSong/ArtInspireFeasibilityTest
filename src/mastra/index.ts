import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { WeatherAgentService } from './agents/weather';
import { MemoryAgentService } from './agents/memo';
import { RagService } from './rag';

@Injectable()
export class MastraService {
  constructor(
    private weatherAgentService: WeatherAgentService,
    private memoryAgentService: MemoryAgentService,
    private ragService: RagService,
  ) {}

  async syncChat(message: string) {
    const response = await this.weatherAgentService.getAgent().generate(message);
    return response.text;
  }

  async getWeather(location: string) {
    const response = await this.weatherAgentService.getAgent().stream(`What's the weather like in ${location}?`);
    return response.textStream;
  }

  async memoTest() {
    // Start a conversation
    const threadId = randomUUID();
    const resourceId = "SOME_USER_ID";

    // Start with a system message
    const response1 = await this.memoryAgentService.getAgent().generate("你好呀，我的是蜜蜂家族的人", {
      threadId,
      resourceId
    });
    console.log(response1.text);

    // Send user message
    const response2 = await this.memoryAgentService.getAgent().generate("你好呀，我叫皮龙", {
      threadId,
      resourceId,
    });

    console.log(response2.text);
    // Use semantic search to find relevant messages
    const response3 = await this.memoryAgentService.getAgent().generate("我刚才说我叫什么？我是哪个家族的？", {
      threadId,
      resourceId,
      memoryOptions: {
        lastMessages: false,
        semanticRecall: {
          topK: 3, // Get top 3 most relevant messages
          messageRange: 2, // Include context around each match
        },
      },
    });
    console.log(response3.text);
  }

  async ragQueryTest() {
    return this.ragService.textRagQuery();
  }

  async ragInit() {
    return this.ragService.initRag();
  }
}
