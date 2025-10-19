import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { ColumnEntity } from 'src/column/column.entity';
import { AuthUserModule } from 'src/auth-user/auth-user.module';

@Module({
   imports: [TypeOrmModule.forFeature([Task, ColumnEntity]),
  AuthUserModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
