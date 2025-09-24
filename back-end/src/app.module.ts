import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthUserModule } from './auth-user/auth-user.module';



@Module({
  imports: [
    DatabaseModule,
    AuthUserModule,
   ],
})
export class AppModule {}
