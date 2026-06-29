import {
  Controller,
  Put,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { VerifyUploadFilePipe } from '../../common/pipes/verify-upload-file.pipe';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get(':collection/:id')
  getUpload(
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    return this.uploadsService.getUpload(collection, id);
  }

  @Put(':collection/:id')
  @UseInterceptors(FileInterceptor('file'))
  cloudinaryUploadFile(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @UploadedFile(VerifyUploadFilePipe) file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.uploadsService.cloudinaryUploadFile(
      collection,
      id,
      file,
      req.userAuth,
    );
  }
}