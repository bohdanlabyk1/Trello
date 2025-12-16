// column.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from './../auth-user/jwt-auth';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // 🔹 Отримати всі колонки проекту
  @Get(':projectId/columns')
  findAll(@Param('projectId') projectId: number, @Req() req) {
    return this.columnService.findByProject(projectId, req.user.id);
  }
  
  @Post(':projectId/columns')
  create(@Param('projectId') projectId: number, @Body('title') title: string, @Req() req) {
    return this.columnService.create(title, projectId, req.user.id);
  }

  // 🔹 Видалити колонку
  @Delete(':projectId/columns/:id')
  remove(@Param('projectId') projectId: number, @Param('id') id: number, @Req() req) {
    return this.columnService.delete(id, req.user.id);
  }
  @Patch('columns/:id/color')
updateColor(
  @Param('id') id: number,
  @Body('color') color: string,
  @Req() req
) {
  return this.columnService.updateColor(id, color, req.user.id);
}

}
