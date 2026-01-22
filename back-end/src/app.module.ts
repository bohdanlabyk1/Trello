import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { ProgectModule } from './progect/progect.module';
import { TaskModule } from './task/task.module';
import { ColumnModule } from './column/column.module';
import { ComentsModule } from './coments/coments.module';
import { InvitationModule } from './invitation/invitation.module';
import { SprintModule } from './sprint/sprint.module';
import { ActivityModule } from './actyviti/actyviti.module';
import { NotificationModule } from './invitation/notifikation.module';



@Module({
  imports: [
    DatabaseModule,
    AuthUserModule,
    ProgectModule,
    TaskModule,
    ColumnModule,
    ComentsModule,
    InvitationModule,
    SprintModule,
    ActivityModule,
    NotificationModule,

   ],
})
export class AppModule {}
