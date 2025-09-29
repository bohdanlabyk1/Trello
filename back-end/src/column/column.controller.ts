import { Controller, Post, Patch, Param, Delete, Body } from '@nestjs/common';
import { ColumnsService } from './column.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() body: { title: string; projectId: number }) {
    return this.columnsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() body: { title?: string }
  ) {
    return this.columnsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.columnsService.remove(id);
  }
}
