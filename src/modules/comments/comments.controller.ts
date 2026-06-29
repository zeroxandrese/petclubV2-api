import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':type/:id')
  findByTarget(
    @Param('id') id: string,
    @Param('type') type: 'IMAGE' | 'NEWS',
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 15,
  ) {
    return this.commentsService.findByTarget(id, type, page, limit);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    const userId = req.user.uid; // depende de tu JWT guard
    return this.commentsService.create(userId, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}