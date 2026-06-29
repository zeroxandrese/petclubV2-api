import { Controller, Post, Param, Body } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('recoveryPassword')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post(':email')
  async request(@Param('email') email: string) {
    return this.recoveryService.requestCode(email);
  }

}