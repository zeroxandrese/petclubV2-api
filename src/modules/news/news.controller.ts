import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsSyncService } from './news.sync.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly newsSyncService: NewsSyncService,
  ) {}

  @Post()
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.newsService.findOne(uid);
  }

  @Patch(':uid/deactivate')
  deactivate(@Param('uid') uid: string) {
    return this.newsService.deactivate(uid);
  }

  // Endpoint manual para sync
  @Post('sync/google-sheet')
  async syncFromSheet() {
    return this.newsSyncService.syncNews();
  }
}