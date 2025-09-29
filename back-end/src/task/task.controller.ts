import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() body: { title: string; description?: string; columnId: number }) {
    return this.tasksService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() body: { title?: string; description?: string }
  ) {
    return this.tasksService.update(id, body);
  }

  @Patch(':id/move')
  move(
    @Param('id') id: number,
    @Body() body: { targetColumnId: number; newOrder: number }
  ) {
    return this.tasksService.move(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tasksService.remove(id);
  }
}
