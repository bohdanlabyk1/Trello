import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
   AuthModule,
   ],
})
export class AppModule {}
