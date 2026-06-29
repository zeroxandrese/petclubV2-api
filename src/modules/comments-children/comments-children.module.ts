import { Module } from '@nestjs/common';
import { CommentsChildrenController } from './comments-children.controller';
import { CommentsChildrenService } from './comments-children.service';

@Module({
  controllers: [CommentsChildrenController],
  providers: [CommentsChildrenService]
})
export class CommentsChildrenModule {}