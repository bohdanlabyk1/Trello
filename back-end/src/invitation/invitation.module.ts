import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './invitation.entiti';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { Auth } from 'src/auth-user/auth-user.entiti';
import { Project } from 'src/progect/project.entiti';
import { Notification } from './noification.entiti';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, Auth, Project, Notification,]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // можеш винести в .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [InvitationService],
  controllers: [InvitationController],
  exports: [InvitationService],
})
export class InvitationModule {}
