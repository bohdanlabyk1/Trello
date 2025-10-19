// src/invitation/invitation.controller.ts
import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { JwtAuthGuard } from './../auth-user/jwt-auth';

@Controller('invitations')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  @Post('invite')
  invite(@Req() req, @Body() body: { email: string; projectId: number }) {
    return this.service.inviteUser(req.user.id, body.email, body.projectId);
  }

  @Get()
  getMyInvitations(@Req() req) {
    return this.service.getUserInvitations(req.user.id);
  }

  @Post(':id/respond')
  respond(
    @Req() req,
    @Param('id') id: number,
    @Body() body: { accept: boolean },
  ) {
    return this.service.respondToInvitation(id, req.user.id, body.accept);
  }
}
