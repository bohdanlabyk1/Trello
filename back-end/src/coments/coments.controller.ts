import { Controller, Post, Delete, Body, Param,Get } from '@nestjs/common';
import { CommentsService } from './coments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() body: { text: string; taskId: number }) {
    return this.commentsService.create(body);
  }

@Get('task/:taskId')
  findByTask(@Param('taskId') taskId: number) {
    return this.commentsService.findByTask(+taskId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
