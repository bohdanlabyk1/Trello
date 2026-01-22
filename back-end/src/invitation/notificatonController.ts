// src/invitation/notificatonController.ts
import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './noification.entiti';
import { JwtAuthGuard } from '../auth-user/jwt-auth';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  @Get()
  getMy(@Req() req) {
    return this.repo.find({
      where: {
        user: { id: req.user.id },
        read: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  @Get('count')
  async getUnreadCount(@Req() req) {
    const count = await this.repo.count({
      where: {
        user: { id: req.user.id },
        read: false,
      },
    });
    return { count };
  }

  @Patch(':id/read')
  markRead(@Param('id') id: number, @Req() req) {
    return this.repo.update(
      { id, user: { id: req.user.id } },
      { read: true },
    );
  }
}
