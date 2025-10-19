// task.controller.ts
import { Controller, Get, Post, Param, Body, Delete, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from './../auth-user/jwt-auth';

@Controller('columns/:columnId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(@Param('columnId') columnId: number, @Req() req) {
    return this.taskService.findByColumn(columnId, req.user.id);
  }

  @Post()
  create(
    @Param('columnId') columnId: number,
    @Body('title') title: string,
    @Body('description') description: string,
    @Req() req,
  ) {
    return this.taskService.create(title, description, columnId, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.taskService.delete(id, req.user.id);
  }
}
