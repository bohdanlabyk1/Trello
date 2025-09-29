import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { ProgectModule } from './progect/progect.module';
import { PanelModule } from './panel/panel.module';
import { TaskModule } from './task/task.module';
import { ColumnModule } from './column/column.module';
import { ComentsModule } from './coments/coments.module';



@Module({
  imports: [
    DatabaseModule,
    AuthUserModule,
    ProgectModule,
    PanelModule,
    TaskModule,
    ColumnModule,
    ComentsModule,
   ],
})
export class AppModule {}
