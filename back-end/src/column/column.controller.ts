// column.controller.ts
import { Controller, Get, Post, Param, Body, Delete, Req, UseGuards } from '@nestjs/common';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from './../auth-user/jwt-auth';

@Controller('projects/:projectId/columns')
@UseGuards(JwtAuthGuard)
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get()
  findAll(@Param('projectId') projectId: number, @Req() req) {
    return this.columnService.findByProject(projectId, req.user.id);
  }

  @Post()
  create(@Param('projectId') projectId: number, @Body('title') title: string, @Req() req) {
    return this.columnService.create(title, projectId, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.columnService.delete(id, req.user.id);
  }
}
