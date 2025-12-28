import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Sprint } from 'src/sprint/sprint.entity';
import { UpdateTaskDto } from './task.dto';
import { ActivityService } from 'src/actyviti/actyviti.service';
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
    private readonly activityService: ActivityService,
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
  select: {
    id: true,
    title: true,
    description: true,
    order: true,
    status: true,
    priority: true,
    label: true,
    sprintId: true,
  },
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

 const oldStatus = task.status;

if (dto.status !== undefined) {
  task.status = dto.status;
}

if (dto.status !== undefined && oldStatus !== dto.status) {
  await this.activityService.log({
    projectId: task.column.project.id,
    userId,
    action: 'CHANGE_STATUS',
    entityType: 'task',
    entityId: task.id,
    meta: {
      from: oldStatus,
      to: dto.status,
    },
  });
}


  return this.taskRepo.save(task);
}

  async create(
  title: string,
  description: string,
  columnId: number,
  userId: number,
  sprintId?: number | null,
) {
  const column = await this.columnRepo.findOne({
    where: { id: columnId },
    relations: ['project', 'project.owner', 'project.members'],
  });

  if (!column) throw new NotFoundException('Column not found');

  const hasAccess =
    column.project.owner.id === userId ||
    column.project.members.some(m => m.id === userId);

  if (!hasAccess) throw new ForbiddenException('Access denied');

  const task = this.taskRepo.create({
    title,
    description,
    column,
    sprintId: sprintId ?? null,
  });

  const savedTask = await this.taskRepo.save(task);

  await this.activityService.log({
    projectId: column.project.id,
    userId,
    action: 'CREATE_TASK',
    entityType: 'task',
    entityId: savedTask.id,
    meta: { title: savedTask.title },
  });

  return savedTask;
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
await this.activityService.log({
  projectId: task.column.project.id,
  userId,
  action: 'DELETE_TASK',
  entityType: 'task',
  entityId: task.id,
  meta: { title: task.title },
});

    return this.taskRepo.remove(task);
  }
  
  async assignTaskToSprint(sprintId: number, taskId: number) {
  const sprint = await this.sprintRepo.findOne({ where: { id: sprintId }, relations: ['tasks'] });
  if (!sprint) throw new NotFoundException('Sprint not found');

  const task = await this.taskRepo.findOne({ where: { id: taskId } });
  if (!task) throw new NotFoundException('Task not found');

  task.sprintId = sprintId;
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

  const targetColumn = await this.columnRepo.findOne({
    where: { id: targetColumnId },
    relations: ['project', 'project.owner', 'project.members'],
  });

  if (!targetColumn) throw new NotFoundException('Target column not found');

  const hasTargetAccess =
    targetColumn.project.owner.id === userId ||
    targetColumn.project.members.some(m => m.id === userId);

  if (!hasTargetAccess) throw new ForbiddenException('Access denied');

  const sourceColumnId = task.column.id;

  /** ===== SOURCE COLUMN ===== */
  const sourceTasks = await this.taskRepo.find({
    where: { column: { id: sourceColumnId } },
    order: { order: 'ASC' },
  });

  const updatedSource = sourceTasks
    .filter(t => t.id !== task.id)
    .map((t, i) => ({ ...t, order: i }));

  /** ===== TARGET COLUMN ===== */
  const targetTasks = await this.taskRepo.find({
    where: { column: { id: targetColumnId } },
    order: { order: 'ASC' },
  });

  task.column = targetColumn;
  targetTasks.splice(newOrder, 0, task);

  const updatedTarget = targetTasks.map((t, i) => ({
    ...t,
    order: i,
  }));
  
await this.activityService.log({
  projectId: task.column.project.id,
  userId,
  action: 'MOVE_TASK',
  entityType: 'task',
  entityId: task.id,
  meta: {
    fromColumn: sourceColumnId,
    toColumn: targetColumnId,
  },
});

  await this.taskRepo.save([...updatedSource, ...updatedTarget]);

  return task;
}

}
