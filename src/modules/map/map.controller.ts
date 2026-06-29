import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { MapService } from './map.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('elementsMap')
@UseGuards(JwtAuthGuard)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  // =========================
  // PET LOST
  // =========================

  @Get('petLost')
  async searchImagesLost(
    @Query() query,
    @Res() res: Response,
  ) {
    const result = await this.mapService.searchImagesLost(query);
    return res.status(result.status).json(result.body);
  }

  // =========================
  // REFUGIOS
  // =========================

  @Get('refugios')
  async searchShelters(@Query() query, @Res() res: Response) {
    const result = await this.mapService.searchShelters(query);
    return res.status(result.status).json(result.body);
  }

  @Post('refugios/cardOpening/:id')
  async cardOpeningShelters(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.cardOpeningShelters(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('refugios/whatsAppRedirects/:id')
  async whatsAppShelters(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.whatsAppShelters(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('refugios/likes/:id')
  async likesShelters(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.likesShelters(
      req.userAuth.uid,
      id,
      body.like,
    );
    return res.status(result.status).json(result.body);
  }

  // =========================
  // EVENT
  // =========================

  @Get('event')
  async searchEvent(@Query() query, @Res() res: Response) {
    const result = await this.mapService.searchEvent(query);
    return res.status(result.status).json(result.body);
  }

  @Post('event/cardOpening/:id')
  async cardOpeningEvent(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.cardOpeningEvent(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('event/whatsAppRedirects/:id')
  async whatsAppEvent(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.whatsAppEvent(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('event/likes/:id')
  async likesEvent(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.likesEvent(
      req.userAuth.uid,
      id,
      body.like,
    );
    return res.status(result.status).json(result.body);
  }

  // =========================
  // PET SHOP
  // =========================

  @Get('petShop')
  async searchPetShop(@Query() query, @Res() res: Response) {
    const result = await this.mapService.searchPetShop(query);
    return res.status(result.status).json(result.body);
  }

  @Post('petShop/cardOpening/:id')
  async cardOpeningPetShop(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.cardOpeningPetShop(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('petShop/whatsAppRedirects/:id')
  async whatsAppPetShop(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.whatsAppPetShop(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('petShop/likes/:id')
  async likesPetShop(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.likesPetShop(
      req.userAuth.uid,
      id,
      body.like,
    );
    return res.status(result.status).json(result.body);
  }

  // =========================
  // VET CENTER
  // =========================

  @Get('vetCenter')
  async searchVetCenter(@Query() query, @Res() res: Response) {
    const result = await this.mapService.searchVetCenter(query);
    return res.status(result.status).json(result.body);
  }

  @Post('vetCenter/cardOpening/:id')
  async cardOpeningVetCenter(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.cardOpeningVetCenter(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('vetCenter/whatsAppRedirects/:id')
  async whatsAppVetCenter(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.whatsAppVetCenter(
      req.userAuth.uid,
      id,
      body.interaction,
    );
    return res.status(result.status).json(result.body);
  }

  @Post('vetCenter/likes/:id')
  async likesVetCenter(
    @Param('id') id: string,
    @Body() body,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.mapService.likesVetCenter(
      req.userAuth.uid,
      id,
      body.like,
    );
    return res.status(result.status).json(result.body);
  }
}