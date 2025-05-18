import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';

import { weatherAgent } from './agents';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MastraService {
  private mastra: Mastra;
  constructor() {
    this.mastra = new Mastra({
      agents: { weatherAgent },
      storage: new LibSQLStore({
        // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
        url: ':memory:',
      }),
      logger: createLogger({
        name: 'Mastra',
        level: 'info',
      }),
    });
  }

  async chat(message: string): Promise<string> {


  }

  async getWeather(location: string): Promise<any> {


  }
}
