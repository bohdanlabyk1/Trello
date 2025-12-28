import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth-user/auth-user.entiti';
import { Project } from 'src/progect/project.entiti';
import { ColumnEntity } from 'src/column/column.entity';
import { Comment } from 'src/coments/coment.entity';
import { Task } from 'src/task/task.entity';
import { Invitation } from 'src/invitation/invitation.entiti';
import { Sprint } from 'src/sprint/sprint.entity';
import { ActivityLog } from '../actyviti/actyviti.entiti';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, 
      username: 'root', 
      password: '1111', 
      database: 'trello',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Auth, Project, ColumnEntity, Comment, Task, Invitation, Sprint, ActivityLog], 
    }),
    TypeOrmModule.forFeature([Auth, Project, ColumnEntity, Comment, Task, Invitation, Sprint, ActivityLog]),
  ],
})
export class DatabaseModule {}
