import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PetsModule } from './modules/pets/pets.module';
import { UsersModule } from './modules/users/users.module';
import { ImagesModule } from './modules/images/images.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { NewsModule } from './modules/news/news.module';
import { RecoveryCodeModule } from './modules/recoveryPasswordCode/recoveryCode.module';
import { RecoveryModule } from './modules/recoveryPassword/recovery.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CommentsChildrenModule } from './modules/comments-children/comments-children.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DeleteUserReasonsModule } from './modules/delete-user-reasons/delete-user-reasons.module';
import { MapModule } from './modules/map/map.module';
import { ReportsModule } from './modules/reports/reports.module';
import { TasksCronService } from './utils/tasks.cron.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    PetsModule, 
    ImagesModule,
    UploadsModule,
    DatabaseModule,
    AuthModule,
    NewsModule,
    CommentsModule,
    CommentsChildrenModule,
    TasksModule,
    DeleteUserReasonsModule,
    MapModule,
    ReportsModule,
    NotificationsModule,
    RecoveryCodeModule,
    RecoveryModule
  ],
  providers: [PrismaService, TasksCronService],
})
export class AppModule {}
