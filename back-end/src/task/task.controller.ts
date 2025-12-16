// task.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from './../auth-user/jwt-auth';
import { Task } from './task.entity';
import { UpdateTaskDto } from './task.dto';

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
 @Patch(':id')
updateTask(
  @Param('id') id: number,
  @Body() dto: UpdateTaskDto,
  @Req() req
) {
  return this.taskService.update(id, dto, req.user.id);
}

  @Post(':taskId/assign-sprint')
  assignToSprint(@Param('taskId') taskId: number, @Body('sprintId') sprintId: number) {
    return this.taskService.assignTaskToSprint(sprintId, taskId);
  }
  @Patch(':id/move')
  move(
    @Param('id') id: number,
    @Body() body: { targetColumnId: number; newOrder: number },
    @Req() req
  ) {
    return this.taskService.moveTask(
      id,
      body.targetColumnId,
      body.newOrder,
      req.user.id
    );
  }
}
