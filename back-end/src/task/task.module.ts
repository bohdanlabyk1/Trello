import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { ColumnEntity } from 'src/column/column.entity';
import { AuthUserModule } from 'src/user/auth-user.module';
import { Sprint } from 'src/sprint/sprint.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
   imports: [TypeOrmModule.forFeature([Task, ColumnEntity, Sprint]),
  AuthUserModule,  ActivityModule,],
  controllers:
   [TaskController,
  ],
  providers: [TaskService],
})
export class TaskModule {}
