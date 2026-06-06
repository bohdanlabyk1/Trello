import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/user/auth-user.entiti';
import { Project } from 'src/project/project.entiti';
import { ColumnEntity } from 'src/column/column.entity';
import { Comment } from 'src/coments/coment.entity';
import { Task } from 'src/task/task.entity';
import { Invitation } from 'src/invitation/invitation.entiti';
import { Sprint } from 'src/sprint/sprint.entity';
import { ActivityLog } from '../activity/activity.entiti';
import { Notification } from 'src/invitation/noification.entiti';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306, 
      username: process.env.DB_USERNAME || 'root', 
      password: process.env.DB_PASSWORD || '1111', 
      database: process.env.DB_DATABASE || 'teamtrack',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Auth, Project, ColumnEntity, Comment, Task, Invitation, Sprint, ActivityLog, Notification], 
      // Багато хмарних MySQL вимагають SSL підключення. Додайте цей блок:
      ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([Auth, Project, ColumnEntity, Comment, Task, Invitation, Sprint, ActivityLog, Notification]),
  ],
})
export class DatabaseModule {}
