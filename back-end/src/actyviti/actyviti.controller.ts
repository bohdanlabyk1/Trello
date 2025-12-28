import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ActivityService } from './actyviti.service';
import { JwtAuthGuard } from '../auth-user/jwt-auth';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get(':projectId')
  getProjectLogs(@Param('projectId') projectId: number) {
    return this.service.getByProject(+projectId);
  }
  @Delete('project/:projectId')
async clearProjectLogs(
  @Param('projectId') projectId: number,
) {
  return this.service.clearProjectLogs(projectId);
}

}
