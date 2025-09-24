import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth-user/auth-user.entiti';

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
      entities: [Auth], 
    }),
    TypeOrmModule.forFeature([Auth]),
  ],
})
export class DatabaseModule {}
