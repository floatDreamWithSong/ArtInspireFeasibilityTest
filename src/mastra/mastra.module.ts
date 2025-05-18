import { Module } from '@nestjs/common';
import { MastraService } from './index';

@Module({
  providers: [MastraService],
  exports: [MastraService],
})
export class MastraModule {} 