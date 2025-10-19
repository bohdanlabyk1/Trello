import { Controller, Post, Get, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { JwtAuthGuard } from 'src/auth-user/jwt-auth';

@Controller('sprints')
@UseGuards(JwtAuthGuard)
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

 @Post()
create(@Body() body: { name: string; startDate: string; endDate: string; projectId: number }, @Req() req) {
  return this.sprintService.create(body, req.user.id);
}

  @Get('/project/:projectId')
  getByProject(@Param('projectId') projectId: number) {
    return this.sprintService.getByProject(projectId);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sprintService.delete(id);
  }
}
