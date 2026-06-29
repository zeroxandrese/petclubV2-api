import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeleteUserReasonsService } from './delete-user-reasons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDeleteUserReasonsDto } from './dto/create-delete-user-reasons.dto';

@Controller('deleteUserReasons')
@UseGuards(JwtAuthGuard)
export class DeleteUserReasonsController {
  constructor(
    private readonly deleteUserReasonsService: DeleteUserReasonsService,
  ) {}

  @Post()
  async createReason(
    @Body() dto: CreateDeleteUserReasonsDto,
    @Req() req: any,
  ) {
    return this.deleteUserReasonsService.create(req.userAuth, dto);
  }

  @Delete()
  async restoreUser(@Req() req: any) {
    return this.deleteUserReasonsService.restore(req.userAuth);
  }
}