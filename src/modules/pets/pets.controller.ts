import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.petsService.findAll(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/oneofuser/:id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/allofuser/:id')
  findAllOfUser(@Param('id') id: string) {
    return this.petsService.findAllOfUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@GetUser() user: any, @UploadedFile() file: Express.Multer.File, @Body() dto: CreatePetDto) {
    return this.petsService.create(user.uid, dto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}