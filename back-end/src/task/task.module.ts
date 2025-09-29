import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './task.entity';
import { ColumnEntity } from 'src/column/column.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Task, ColumnEntity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TaskModule {}
