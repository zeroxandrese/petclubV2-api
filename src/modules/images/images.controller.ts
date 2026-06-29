import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VerifyUploadFilePipe } from '../../common/pipes/verify-upload-file.pipe';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('images')
//@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  getImages(@Query('page') page?: string) {
    return this.imagesService.getImages(page);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createImage(
    @GetUser() user: any,
    @Body() dto: CreateImageDto,
    @UploadedFile(VerifyUploadFilePipe) file: Express.Multer.File,
  ) {
    return this.imagesService.createImage(user.uid, dto, file);
  }

  @Put(':id')
  updateImage(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.imagesService.updateImage(id, body);
  }

  @Delete(':id')
  deleteImage(@Param('id') id: string) {
    return this.imagesService.deleteImage(id);
  }
}