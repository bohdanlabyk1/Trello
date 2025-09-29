import { Module } from '@nestjs/common';
import { CommentsService } from './coments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './coments.controller';
import { Comment } from './coment.entity';
import { Task } from 'src/task/task.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Comment, Task])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class ComentsModule {}
