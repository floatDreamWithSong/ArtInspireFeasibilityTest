import { Injectable } from '@nestjs/common';
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { fastembed } from "@mastra/fastembed";
import { QwenService } from "../../model/qwen";
import { PgVector, PostgresStore } from "@mastra/pg";
import { ConfigurationService } from "../../../config/configuration";

@Injectable()
export class MemoryAgentService {
  private memory: Memory;
  private agent: Agent;

  constructor(
    private configService: ConfigurationService,
    private qwenService: QwenService,
  ) {
    this.memory = new Memory({
      storage: new PostgresStore({
        connectionString: this.configService.pgVectorConfig.connectionString,
      }),
      vector: new PgVector({
        connectionString: this.configService.pgVectorConfig.connectionString,
      }),
      embedder: fastembed,
      options: {
        lastMessages: 0,
        semanticRecall: false,
        threads: {
          generateTitle: false,
        },
      },
    });

    this.agent = new Agent({
      name: "Memory Agent",
      instructions: "You are an AI agent with the ability to automatically recall memories from previous interactions.",
      model: this.qwenService.getQwen()('qwen-turbo'),
      memory: this.memory,
    });
  }

  getAgent() {
    return this.agent;
  }
}