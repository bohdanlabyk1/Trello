import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Sprint } from 'src/sprint/sprint.entity';
import { UpdateTaskDto } from './task.dto';
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
      order: { order: 'ASC' }, 
    });
  }
async update(
  id: number,
  dto: UpdateTaskDto,
  userId: number,
) {
  const task = await this.taskRepo.findOne({
    where: { id },
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

  if (dto.title !== undefined) task.title = dto.title;
  if (dto.description !== undefined) task.description = dto.description;
  if (dto.status !== undefined) task.status = dto.status;
  if (dto.priority !== undefined) task.priority = dto.priority;
  if (dto.label !== undefined) task.label = dto.label;

  if (dto.sprintId !== undefined) {
    task.sprint = dto.sprintId
      ? await this.sprintRepo.findOne({ where: { id: dto.sprintId } })
      : null;
  }

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
  userId: number,
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

  const sourceColumn = await this.columnRepo.findOne({
    where: { id: task.column.id },
    relations: ['tasks'],
  });

  const targetColumn = await this.columnRepo.findOne({
    where: { id: targetColumnId },
    relations: ['tasks'],
  });

  if (!sourceColumn || !targetColumn)
    throw new NotFoundException('Column not found');

  // 🧹 SOURCE: прибрати задачу і пересортувати
  const sourceTasks = sourceColumn.tasks
    .filter(t => t.id !== task.id)
    .sort((a, b) => a.order - b.order);

  sourceTasks.forEach((t, i) => (t.order = i));

  // 🎯 TARGET: вставити задачу
  const targetTasks = targetColumn.tasks
    .filter(t => t.id !== task.id)
    .sort((a, b) => a.order - b.order);

  targetTasks.splice(newOrder, 0, task);
  targetTasks.forEach((t, i) => (t.order = i));

  task.column = targetColumn;

  await this.taskRepo.save([...sourceTasks, ...targetTasks]);
  return task;
}
}
