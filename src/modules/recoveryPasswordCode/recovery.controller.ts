import { Controller, Post, Param, Body } from '@nestjs/common';
import { RecoveryService } from '../recoveryPassword/recovery.service';
import { VerifyCodeDto } from '../recoveryPassword/dto/verify-code.dto';

@Controller('recoveryPasswordCode')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post(':email')
  async verify(@Param('email') email: string, @Body() body: VerifyCodeDto) {
    return this.recoveryService.verifyCode(email, body.code);
  }
}