import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsSyncService } from './news.sync.service';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    NewsSyncService
  ],
  exports: [NewsService],
})
export class NewsModule {}