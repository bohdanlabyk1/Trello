// project.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './../column/column.entity';
import { Project } from './project.entiti';
import { Auth } from './../auth-user/auth-user.entiti';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Auth)
    private readonly userRepo: Repository<Auth>,
    @InjectRepository(ColumnEntity)
private readonly columnRepo: Repository<ColumnEntity>,

  ) {}

async create(data: { name: string; description: string }, userId: number) {
  const user = await this.userRepo.findOneBy({ id: userId });
  if (!user) throw new NotFoundException('User not found');

  // створюємо проект
  const project = this.projectRepo.create({
    name: data.name,
    description: data.description,
    owner: user,
  });

  const savedProject = await this.projectRepo.save(project);

  const defaultColumns = [
    { title: 'To Do', order: 1 },
    { title: 'In Progress', order: 2 },
    { title: 'Done', order: 3 },
  ];

  for (const col of defaultColumns) {
    await this.columnRepo.save(
      this.columnRepo.create({
        title: col.title,
        order: col.order,
        project: savedProject
      })
    );
  }

  return savedProject;
}

 async deleteProject(projectId: number, userId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner'],
    });

    if (!project) throw new NotFoundException('Project not found');

    // лише власник може видаляти
    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only owner can delete the project');
    }

    await this.projectRepo.remove(project);

    return { message: 'Project deleted successfully' };
  }
async addUserToProject(projectId: number, userEmail: string, ownerId: number) {
  const project = await this.projectRepo.findOne({
    where: { id: projectId },
    relations: ['owner', 'members'],
  });
  if (!project) throw new NotFoundException('Project not found');

  if (project.owner.id !== ownerId)
    throw new ForbiddenException('Only owner can add users');

  const user = await this.userRepo.findOneBy({ email: userEmail });
  if (!user) throw new NotFoundException('User not found');

  if (project.members.some((u) => u.id === user.id))
    throw new Error('User already in project');

  project.members.push(user);
  return this.projectRepo.save(project);
}

async getProjectUsers(projectId: number) {
  const project = await this.projectRepo.findOne({
    where: { id: projectId },
    relations: ['members'],
  });
  if (!project) throw new NotFoundException('Project not found');
  return project.members;
}

async findByUser(userId: number) {
  return this.projectRepo.find({
    where: [
      { owner: { id: userId } }, // користувач — власник
      { members: { id: userId } } // або учасник
    ],
    relations: ['columns', 'members', 'owner'],
  });
}

async findOneByUser(projectId: number, userId: number) {
  const project = await this.projectRepo.findOne({
    where: { id: projectId },
    relations: ['owner', 'members', 'columns'],
  });

  if (!project) throw new NotFoundException('Project not found');

  if (
    project.owner.id !== userId &&
    !project.members.some((u) => u.id === userId)
  ) {
    throw new ForbiddenException('Access denied');
  }

  return project;
}

}
