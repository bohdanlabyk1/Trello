import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { Project } from './../progect/project.entiti';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepo: Repository<ColumnEntity>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findByProject(projectId: number, userId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    });

    if (!project) throw new NotFoundException('Project not found');

    const hasAccess =
      project.owner.id === userId ||
      project.members.some((m) => m.id === userId);

    if (!hasAccess) throw new ForbiddenException('Access denied');

    return this.columnRepo.find({
      where: { project: { id: projectId } },
      relations: [],
       order: { order: 'ASC' },
    });
  }

  async create(title: string, projectId: number, userId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    });

    if (!project) throw new NotFoundException('Project not found');

    const hasAccess =
      project.owner.id === userId ||
      project.members.some((m) => m.id === userId);

    if (!hasAccess) throw new ForbiddenException('Access denied');

    const column = this.columnRepo.create({ title, project });
    return this.columnRepo.save(column);
  }

  async delete(columnId: number, userId: number) {
    const column = await this.columnRepo.findOne({
      where: { id: columnId },
      relations: ['project', 'project.owner', 'project.members'],
    });

    if (!column) throw new NotFoundException('Column not found');

    const hasAccess =
      column.project.owner.id === userId ||
      column.project.members.some((m) => m.id === userId);

    if (!hasAccess) throw new ForbiddenException('Access denied');

    return this.columnRepo.remove(column);
  }
  async updateColor(columnId: number, color: string, userId: number) {
  const column = await this.columnRepo.findOne({
    where: { id: columnId },
    relations: ['project', 'project.owner', 'project.members'],
  });

  if (!column) throw new NotFoundException();

  const hasAccess =
    column.project.owner.id === userId ||
    column.project.members.some(m => m.id === userId);

  if (!hasAccess) throw new ForbiddenException();

  column.color = color;
  return this.columnRepo.save(column);
}
}
