import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { ProgectModule } from './progect/progect.module';
import { PanelModule } from './panel/panel.module';



@Module({
  imports: [
    DatabaseModule,
    AuthUserModule,
    ProgectModule,
    PanelModule,
   ],
})
export class AppModule {}
