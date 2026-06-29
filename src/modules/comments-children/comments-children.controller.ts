import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsChildrenService } from './comments-children.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCommentsChildrenDto } from './dto/create-comments-children.dto';
import { UpdateCommentsChildrenDto } from './dto/update-comments-children.dto';

@Controller('commentsChildren')
@UseGuards(JwtAuthGuard)
export class CommentsChildrenController {
  constructor(private readonly commentsChildrenService: CommentsChildrenService) {}

  @Get(':id')
  async getComments(@Param('id') id: string, @Query('page') page?: string) {
    return this.commentsChildrenService.getByFather(id, page);
  }

  @Put(':id')
  async updateComment(@Param('id') id: string, @Body() updateDto: UpdateCommentsChildrenDto) {
    return this.commentsChildrenService.update(id, updateDto.comments);
  }

  @Post(':id')
  async createComment(@Param('id') id: string, @Body() createDto: CreateCommentsChildrenDto, @Req() req: any) {
    return this.commentsChildrenService.create(id, createDto.comments, req.userAuth);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return this.commentsChildrenService.softDelete(id);
  }
}