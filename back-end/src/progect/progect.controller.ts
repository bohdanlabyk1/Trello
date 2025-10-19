// project.controller.ts
import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './progect.service';
import { JwtAuthGuard } from './../auth-user/jwt-auth';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(@Req() req) {
    return this.projectService.findByUser(req.user.id);
  }

  @Post()
create(@Body('name') name: string, @Body('description') description: string, @Req() req) {
  return this.projectService.create({ name, description }, req.user.id);
}

@Post(':id/users')
addUser(
  @Param('id') id: number,
  @Body('email') email: string,
  @Req() req
) {
  return this.projectService.addUserToProject(id, email, req.user.id);
}

@Get(':id/users')
getUsers(@Param('id') id: number) {
  return this.projectService.getProjectUsers(id);
}


  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.projectService.findOneByUser(id, req.user.id);
  }
}
