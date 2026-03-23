import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { JwtAuthGuard } from '../user/jwt-auth';

@Controller('invitations')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  @Post('invite')
  invite(@Req() req, @Body() body: { email: string; projectId: number }) {
    return this.service.inviteUser(req.user.id, body.email, body.projectId);
  }

  @Get('sent')
getSent(@Req() req) {
  return this.service.getSentInvitations(req.user.id);
}


  @Get()
  getMyInvitations(@Req() req) {
    return this.service.getUserInvitations(req.user.id);
  }

  @Get('count')
  getCount(@Req() req) {
    return this.service.getPendingCount(req.user.id);
  }

  @Post(':id/respond')
  respond(
    @Req() req,
    @Param('id') id: number,
    @Body() body: { accept: boolean },
  ) {
    return this.service.respondToInvitation(id, req.user.id, body.accept);
  }
  @Patch(':id/read')
markAsRead(
  @Param('id') id: number,
  @Req() req,
) {
  return this.service.markAsRead(
    id,
    req.user.id,
  );
}

}
