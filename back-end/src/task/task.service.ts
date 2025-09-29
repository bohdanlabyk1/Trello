// task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { ColumnEntity } from 'src/column/column.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepo: Repository<ColumnEntity>,
  ) {}

  async create(dto: { title: string; description?: string; columnId: number }) {
    const column = await this.columnRepo.findOne({ where: { id: dto.columnId } });
    if (!column) throw new NotFoundException('Column not found');

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      column,
    });
    return this.taskRepo.save(task);
  }

  async update(id: number, dto: { title?: string; description?: string }) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: number) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return this.taskRepo.remove(task);
  }

  async move(id: number, dto: { targetColumnId: number; newOrder: number }) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['column'] });
    if (!task) throw new NotFoundException('Task not found');

    const newColumn = await this.columnRepo.findOne({ where: { id: dto.targetColumnId }, relations: ['tasks'] });
    if (!newColumn) throw new NotFoundException('Target column not found');

    // змінюємо колонку і порядок
    task.column = newColumn;
    task.order = dto.newOrder;

    // пересортування існуючих задач у колонці
    newColumn.tasks.forEach((t) => {
      if (t.id !== task.id && t.order >= dto.newOrder) {
        t.order++;
      }
    });

    await this.taskRepo.save(newColumn.tasks);
    return this.taskRepo.save(task);
  }

  async findByColumn(columnId: number) {
    return this.taskRepo.find({
      where: { column: { id: columnId } },
      relations: ['comments'],
      order: { order: 'ASC' },
    });
  }
}
