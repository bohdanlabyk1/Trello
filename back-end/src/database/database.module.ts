import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth-user/auth-user.entiti';
import { Panel } from 'src/panel/panel.entity';
import { Project } from 'src/progect/project.entiti';
import { Item } from '../panel/item.entity';
import { ColumnEntity } from 'src/column/column.entity';
import { Comment } from 'src/coments/coment.entity';
import { Task } from 'src/task/task.entity';

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
      entities: [Auth, Project, Panel, Item, ColumnEntity, Comment, Task], 
    }),
    TypeOrmModule.forFeature([Auth, Project, Panel, Item, ColumnEntity, Comment, Task]),
  ],
})
export class DatabaseModule {}
