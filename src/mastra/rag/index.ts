import { Injectable } from '@nestjs/common';
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import { embed } from "ai";
import { QwenService } from "../model/qwen";
import { ragQueryText, store } from "src/constant";
import { ConfigurationService } from "../../config/configuration";

@Injectable()
export class RagService {
  private pgVector: PgVector;
  private embedder;
  private readonly indexName = 'test_index';

  constructor(
    private configService: ConfigurationService,
    private qwenService: QwenService,
  ) {
    this.pgVector = new PgVector(this.configService.pgVectorConfig);
    this.embedder = this.qwenService.getOpenAI().embedding('text-embedding-v2');
  }

  async textRagQuery() {
    const { embedding } = await embed({
      model: this.embedder,
      value: ragQueryText,
    });
    console.log('创建查询embedding成功');
    console.log(embedding);
    console.log('开始查询');

    const result = await this.pgVector.query({
      indexName: this.indexName,
      queryVector: embedding,
      topK: 3,
    });
    console.log("Results:", result);
    return result;
  }

  async initRag() {
    const doc = MDocument.fromText(store);

    const chunks = await doc.chunk({
      strategy: "recursive",
      size: 512,
      overlap: 50,
    });
    
    for (let i = 0; i < 3; i++) {
      const chunk = chunks[i];
      console.log(i, '\n');
      console.log(chunk.text);
    }

    const embeddings: any[] = [];
    for (let i = 0; i < 5; i++) {
      const { embedding } = await embed({
        model: this.embedder,
        value: chunks[i].text,
      });
      embeddings.push(embedding);
      console.log(embedding);
    }

    await this.pgVector.createIndex({
      indexName: this.indexName,
      dimension: 1536,
    });
    console.log('创建索引成功');

    await this.pgVector.upsert({
      indexName: this.indexName,
      vectors: embeddings,
      metadata: chunks?.map((chunk: any) => ({ text: chunk.text })),
    });
    console.log('创建表成功');
  }
}

