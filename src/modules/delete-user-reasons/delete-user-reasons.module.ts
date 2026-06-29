import { Module } from '@nestjs/common';
import { DeleteUserReasonsController } from './delete-user-reasons.controller';
import { DeleteUserReasonsService } from './delete-user-reasons.service';

@Module({
  controllers: [DeleteUserReasonsController],
  providers: [DeleteUserReasonsService],
})
export class DeleteUserReasonsModule {}