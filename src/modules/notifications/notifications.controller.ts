import { Controller, Put, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationParamDto } from './dto/notification-param.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Put(':id')
  async markAsSeen(
    @Param() params: NotificationParamDto
  ) {

    return this.notificationsService.markAsSeen(params.id);
  }
}