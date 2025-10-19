import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './sprint.entity';
import { Project } from './../progect/project.entiti';
import { Auth } from './../auth-user/auth-user.entiti';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Auth)
    private readonly userRepo: Repository<Auth>,
  ) {}

 async create({ name, startDate, endDate, projectId }, userId: number) {
  const project = await this.projectRepo.findOne({ 
    where: { id: projectId }, 
    relations: ['members', 'owner'] // додаємо owner
  });
  if (!project) throw new NotFoundException('Project not found');

  const isUserInProject = project.owner.id === userId || project.members.some(u => u.id === userId);
  if (!isUserInProject) throw new ForbiddenException('User not part of project');

  const sprint = this.sprintRepo.create({ name, startDate, endDate, project });
  return this.sprintRepo.save(sprint);
}

  async getByProject(projectId: number) {
    return this.sprintRepo.find({ where: { project: { id: projectId } }, relations: ['tasks'] });
  }

  async delete(id: number) {
    const sprint = await this.sprintRepo.findOne({ where: { id } });
    if (!sprint) throw new NotFoundException('Sprint not found');
    return this.sprintRepo.remove(sprint);
  }
}
