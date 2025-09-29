// column.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { Project } from './../progect/project.entiti';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepo: Repository<ColumnEntity>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(dto: { title: string; projectId: number }) {
    const project = await this.projectRepo.findOne({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const column = this.columnRepo.create({
      title: dto.title,
      project,
    });
    return this.columnRepo.save(column);
  }

  async update(id: number, dto: { title?: string }) {
    const column = await this.columnRepo.findOne({ where: { id } });
    if (!column) throw new NotFoundException('Column not found');

    Object.assign(column, dto);
    return this.columnRepo.save(column);
  }

  async remove(id: number) {
    const column = await this.columnRepo.findOne({ where: { id } });
    if (!column) throw new NotFoundException('Column not found');
    return this.columnRepo.remove(column);
  }

  async findByProject(projectId: number) {
    return this.columnRepo.find({
      where: { project: { id: projectId } },
      relations: ['tasks'],
      order: { order: 'ASC' },
    });
  }
}
