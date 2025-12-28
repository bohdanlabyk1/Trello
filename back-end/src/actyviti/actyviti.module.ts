import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './actyviti.entiti';
import { ActivityService } from './actyviti.service';
import { ActivityController } from './actyviti.controller';
import { AuthUserModule } from './../auth-user/auth-user.module'; // ✅

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), AuthUserModule],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService]
})
export class ActivityModule {}
