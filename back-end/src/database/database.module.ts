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
      // ВИПРАВЛЕНО: прибрали зайві лапки навколо process.env.DB_HOST
      host: process.env.DB_HOST, 
      // ВИПРАВЛЕНО: додали значення за замовчуванням для порту, якщо змінна порожня
      port: parseInt(process.env.DB_PORT) || 14176, 
      username: process.env.DB_USERNAME, 
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Це створить твої таблиці автоматично
      
      // ОБОВ'ЯЗКОВО ДЛЯ AIVEN: без цього буде помилка SSL
      ssl: {
        rejectUnauthorized: false
      },
      
      entities: [Auth, Project, ColumnEntity, Comment, Task, Invitation, Sprint, ActivityLog, Notification], 
    }),
    TypeOrmModule.forFeature([Auth, Project, ColumnEntity, Comment, Task, Invitation, Sprint, ActivityLog, Notification]),
  ],
})
export class DatabaseModule {}
