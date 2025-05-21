import { Injectable } from '@nestjs/common';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../../tools/weather';
import { QwenService } from '../../model/qwen';
import { ConfigurationService } from '../../../config/configuration';

@Injectable()
export class WeatherAgentService {
  private agent: Agent;

  constructor(
    private configService: ConfigurationService,
    private qwenService: QwenService,
  ) {
    this.agent = new Agent({
      name: 'Weather Agent',
      instructions: `
        You are a helpful weather assistant that provides accurate weather information.
        Your primary function is to help users get weather details for specific locations. When responding:
        - Always ask for a location if none is provided
        - If the location name isn't in English, please translate it
        - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
        - Include relevant details like humidity, wind conditions, and precipitation
        - Keep responses concise but informative
        Use the weatherTool to fetch current weather data.
      `,
      model: this.qwenService.getQwen()('qwen-turbo'),
      tools: { weatherTool },
      memory: new Memory({
        storage: new LibSQLStore({
          url: 'file:mastra.db',
        }),
        options: {
          lastMessages: 3,
          semanticRecall: false,
          threads: {
            generateTitle: false,
          },
        },
      }),
    });
  }

  getAgent() {
    return this.agent;
  }
}
