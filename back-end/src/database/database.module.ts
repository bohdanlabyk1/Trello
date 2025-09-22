import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/model.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, 
      username: 'root', 
      password: '12345', 
      database: 'dashboard',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User], 
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule {}
