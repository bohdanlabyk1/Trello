import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './activity.entiti';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity';
import { AuthUserModule } from '../user/auth-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), AuthUserModule],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService]
})
export class ActivityModule {}
