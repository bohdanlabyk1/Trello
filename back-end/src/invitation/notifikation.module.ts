import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notificatonController';
import { Notification } from './noification.entiti';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth-user/jwt-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [NotificationController],
  providers: [JwtAuthGuard],
  exports: [],
})
export class NotificationModule {}
