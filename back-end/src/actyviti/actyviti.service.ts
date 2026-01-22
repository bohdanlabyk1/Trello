import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './actyviti.entiti';
import { Auth } from '../auth-user/auth-user.entiti';
import { Project } from '../progect/project.entiti';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repo: Repository<ActivityLog>,
  ) {}

  async log(data: {
    userId: number;
    projectId: number;
    action: string;
    entityType?: string;
    entityId?: number;
    meta?: any;
  }) {
    const activity = this.repo.create({
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      meta: data.meta,
      user: { id: data.userId } as Auth,
      project: { id: data.projectId } as Project,
    });

    return this.repo.save(activity);
  }

  async getByProject(projectId: number) {
    return this.repo.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  async clearProjectLogs(projectId: number) {
    await this.repo.delete({ project: { id: projectId } });
    return { success: true };
  }
}
