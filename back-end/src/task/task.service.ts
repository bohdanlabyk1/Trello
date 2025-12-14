import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Sprint } from 'src/sprint/sprint.entity';
import { ColumnEntity } from 'src/column/column.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepo: Repository<ColumnEntity>,
     @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
  ) {}

  async findByColumn(columnId: number, userId: number) {
    const column = await this.columnRepo.findOne({
      where: { id: columnId },
      relations: ['project', 'project.owner', 'project.members'],
    });

    if (!column) throw new NotFoundException('Column not found');

    const hasAccess =
      column.project.owner.id === userId ||
      column.project.members.some((m) => m.id === userId);

    if (!hasAccess) throw new ForbiddenException('Access denied');

    return this.taskRepo.find({
      where: { column: { id: columnId } },
      relations: ['comments'],
    });
  }
 async update(id: number, updateTaskDto: Task, userId: number, columnId: number) {
  const task = await this.taskRepo.findOne({
    where: { id },
    relations: ['column', 'column.project', 'column.project.owner', 'column.project.members'],
  });

  if (!task) throw new NotFoundException('Task not found');

  const hasAccess =
    task.column.project.owner.id === userId ||
    task.column.project.members.some((m) => m.id === userId);

  if (!hasAccess) throw new ForbiddenException('Access denied');

  Object.assign(task, updateTaskDto);
  return this.taskRepo.save(task);
}

  async create(title: string, description: string, columnId: number, userId: number) {
    const column = await this.columnRepo.findOne({
      where: { id: columnId },
      relations: ['project', 'project.owner', 'project.members'],
    });

    if (!column) throw new NotFoundException('Column not found');

    const hasAccess =
      column.project.owner.id === userId ||
      column.project.members.some((m) => m.id === userId);

    if (!hasAccess) throw new ForbiddenException('Access denied');

    const task = this.taskRepo.create({ title, description, column });
    return this.taskRepo.save(task);
  }

  async delete(taskId: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['column', 'column.project', 'column.project.owner', 'column.project.members'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const hasAccess =
      task.column.project.owner.id === userId ||
      task.column.project.members.some((m) => m.id === userId);

    if (!hasAccess) throw new ForbiddenException('Access denied');

    return this.taskRepo.remove(task);
  }
  
  async assignTaskToSprint(sprintId: number, taskId: number) {
  const sprint = await this.sprintRepo.findOne({ where: { id: sprintId }, relations: ['tasks'] });
  if (!sprint) throw new NotFoundException('Sprint not found');

  const task = await this.taskRepo.findOne({ where: { id: taskId } });
  if (!task) throw new NotFoundException('Task not found');

  task.sprint = sprint;
  return this.taskRepo.save(task);
}
async moveTask(
  taskId: number,
  targetColumnId: number,
  newOrder: number,
  userId: number
) {
  const task = await this.taskRepo.findOne({
    where: { id: taskId },
    relations: [
      'column',
      'column.project',
      'column.project.owner',
      'column.project.members',
    ],
  });

  if (!task) throw new NotFoundException('Task not found');

  const hasAccess =
    task.column.project.owner.id === userId ||
    task.column.project.members.some(m => m.id === userId);

  if (!hasAccess) throw new ForbiddenException('Access denied');

  const targetColumn = await this.columnRepo.findOne({
    where: { id: targetColumnId },
  });

  if (!targetColumn)
    throw new NotFoundException('Target column not found');

  task.column = targetColumn;
  task.order = newOrder;

  return this.taskRepo.save(task);
}

}
